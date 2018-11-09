import GameObject from './GameObject'
import {
   Vector3,
   Ray,
   Mesh,
   SceneLoader,
   AbstractMesh,
   Color3,
   Space,
} from 'babylonjs'
import { delay } from 'lodash'
import InteractablePost from './InteractablePost'
import gui from './util/gui'
import GrapplingLine from './GrapplingLine'

export enum PlayerMode {
   Downhill,
   Cornering,
   Ragdoll,
}

const down = Vector3.Down()

export default class Player extends GameObject {
   mode = PlayerMode.Downhill
   startPosition = new Vector3(0, 3, 0)
   startRotation = new Vector3(0, Math.PI, 0)
   startScaling = new Vector3(1.5, 1.5, 1.5)
   grapplingLine = new GrapplingLine()
   ray = new Ray(Vector3.Zero(), down)
   offsetFromGround = 1
   wasTouchingGroundLastFrame = false
   cameraTarget = new Mesh('cameraTarget')
   cameraTargetOffset = new Vector3(0, 0, 0)
   startForceAngle = 0.1
   forceAngle = 0
   targetForceAngle = 0
   targetRotationY = 0
   startSpeed = 3
   speed = 0
   maxSpeed = 10
   isCornering = false
   corneringRadius = 0
   corneringDuration = 0
   corneringStartAngle = 0
   corneringPost: InteractablePost | null = null
   corneringAcceleration = 0.03
   driftDeadZone = 0
   trackAngle = 0
   ragdollSpinSpeed = 0.01
   ragdollFallSpeed = 0.0185
   ragdollShrinkRate = 0.0013
   maxTurnSpeed = 0.004
   grappleOffset = Vector3.Forward()
   downhillAngle = 0
   overCorrect = 0.18

   reset() {
      this.speed = this.startSpeed
      this.targetForceAngle = this.forceAngle = this.startForceAngle
      this.mesh.position = this.startPosition.clone()
      this.mesh.rotation = this.startRotation.clone()
      this.mesh.scaling = this.startScaling.clone()
      this.mesh.setPivotPoint(new Vector3(0, 1.5, -1.2))
      this.mode = PlayerMode.Downhill
   }

   createMaterial() {
      const material = new BABYLON.StandardMaterial(
         'playerMaterial',
         this.scene
      )
      material.diffuseColor = Color3.FromHexString('#27acfc')
      material.specularColor = Color3.Black()
      material.backFaceCulling = false
      return material
   }

   start() {
      SceneLoader.ImportMesh(
         '',
         'dist/',
         require('../art/blender/penguin.babylon').replace(/\/dist\//g, ''),
         this.scene,
         (newMeshes: AbstractMesh[]) => {
            const material = this.createMaterial()
            this.mesh = new AbstractMesh('penguinParts') as Mesh
            let index = 0
            const meshesForShadows = [] as AbstractMesh[]
            for (let mesh of newMeshes) {
               if (index++ > 4) {
                  mesh.isVisible = false
               } else {
                  meshesForShadows.push(mesh)
                  mesh.parent = this.mesh
                  mesh.material = material
               }
            }

            this.reset()
            this.game.lighting.ready(meshesForShadows)
         }
      )

      const { arcCamera, followCamera } = this.game.camera
      if (followCamera) {
         followCamera.lockedTarget = this.cameraTarget
      }
      if (arcCamera) {
         arcCamera.lockedTarget = this.cameraTarget
      }
      this.setupDebugGui()
   }

   private setupDebugGui() {
      const playerDebugGui = gui.addFolder('Player')
      playerDebugGui.add(this, 'corneringAcceleration', 0, 10)
      playerDebugGui.add(this, 'startSpeed', 0, 10)
      playerDebugGui.add(this, 'speed', 0, 10)
      playerDebugGui.add(this, 'driftDeadZone', 0, 5)
      playerDebugGui.add(this, 'ragdollSpinSpeed', 0.01, 0.1)
      playerDebugGui.add(this, 'ragdollFallSpeed', 0.001, 0.1)
      playerDebugGui.add(this, 'ragdollShrinkRate', 0.001, 0.01)
      playerDebugGui.add(this, 'overCorrect', 0, 0.5)
   }

   update() {
      const { deltaTime } = this.game
      const { position } = this.mesh
      let exitAngleAnimationSpeed = 0

      if (this.game.isPlaying) {
         if (this.mode != PlayerMode.Ragdoll) {
            // check for cornering
            this.checkCorneringStatus()

            // check ground beneath us
            this.ray.origin = position
            this.ray.direction = down
            const result = this.ray.intersectsMesh(this.game.track.mesh, false)
            if (result.hit) {
               const normal = result.getNormal(true, true)!
               const across = Vector3.Cross(normal, Vector3.Down())
               const downhillVector = Vector3.Cross(across, normal)
               this.trackAngle = Math.atan2(downhillVector.x, downhillVector.z)
               this.downhillAngle = Math.atan2(
                  downhillVector.length(),
                  downhillVector.y
               )

               // pin y to floor
               position.y = result.pickedPoint!.y + this.offsetFromGround
               if (this.mode === PlayerMode.Downhill) {
                  position.x +=
                     (Math.sin(this.forceAngle) * this.speed * deltaTime) / 100
                  position.z +=
                     (Math.cos(this.forceAngle) * this.speed * deltaTime) / 100
               }

               if (this.mode === PlayerMode.Cornering) {
                  this.corneringDuration += this.game.deltaTime
                  const {
                     rotations,
                     directionMultiplier,
                     exitAngle,
                     mesh: corneringPostMesh,
                  } = this.corneringPost!
                  const angle =
                     this.corneringStartAngle +
                     (directionMultiplier *
                        this.corneringDuration *
                        (12 / this.corneringRadius) *
                        (this.speed / 10)) /
                        124
                  position.x =
                     corneringPostMesh.position.x +
                     Math.sin(angle) * this.corneringRadius
                  position.z =
                     corneringPostMesh.position.z +
                     Math.cos(angle) * this.corneringRadius

                  this.speed += (this.corneringAcceleration * deltaTime) / 1000

                  this.targetForceAngle =
                     exitAngle +
                     // add in a little over-correction
                     directionMultiplier * this.overCorrect

                  if (rotations <= 1 / 3) {
                     exitAngleAnimationSpeed = 350
                  } else {
                     exitAngleAnimationSpeed = 600 * (rotations / 0.5)
                  }
                  this.mesh.translate(Vector3.Forward(), -1, Space.LOCAL)
                  this.grapplingLine.updateCornering(
                     this.mesh.getAbsolutePosition().clone(),
                     angle,
                     deltaTime
                  )
                  this.mesh.translate(Vector3.Forward(), 1, Space.LOCAL)
               }

               // head towards target angle
               const angleDeltaToTarget =
                  this.targetForceAngle - this.forceAngle
               let angleDelta =
                  angleDeltaToTarget /
                  (this.mode === PlayerMode.Downhill
                     ? 600
                     : exitAngleAnimationSpeed)
               this.forceAngle += angleDelta * deltaTime
               //head downhill
               //    const angleDeltaVerticalToTarget =
               //       this.downhillAngle - this.mesh.rotation.x
               //    let angleVerticalDelta = angleDeltaVerticalToTarget / 500

               this.mesh.rotation.y = this.forceAngle - Math.PI

               this.mesh.rotation.x = -this.downhillAngle + Math.PI / 2
            } else {
               // no ground beneath us so ragdoll
               this.mode = PlayerMode.Ragdoll
               this.grapplingLine.stopCornering()
               delay(() => {
                  console.log('game over')
                  this.game.isPlaying = false
                  this.game.reset()
               }, 500)
            }
         } else {
            //ragdoll animation
            position.x +=
               (Math.sin(this.forceAngle) * this.speed * deltaTime) / 100
            position.z +=
               (Math.cos(this.forceAngle) * this.speed * deltaTime) / 100
            position.y -= this.ragdollFallSpeed * deltaTime
            this.mesh.rotation.y += this.ragdollSpinSpeed * deltaTime
            this.mesh.scaling.x = Math.max(
               0,
               this.mesh.scaling.x - this.ragdollShrinkRate * deltaTime
            )
            this.mesh.scaling.y = Math.max(
               0,
               this.mesh.scaling.y - this.ragdollShrinkRate * deltaTime
            )
            this.mesh.scaling.z = Math.max(
               0,
               this.mesh.scaling.z - this.ragdollShrinkRate * deltaTime
            )
         }
      }

      // update camera target
      this.cameraTarget.position = position.add(this.cameraTargetOffset)
   }

   checkCorneringStatus() {
      if (
         this.game.track.availableInteractable &&
         this.game.isPointerDown &&
         this.mode !== PlayerMode.Cornering
      ) {
         this.startCornering()
      }
      if (
         this.mode === PlayerMode.Cornering &&
         (!this.game.isPointerDown ||
            this.game.track.availableInteractable === null)
      ) {
         this.stopCornering()
      }
   }

   startCornering() {
      this.mode = PlayerMode.Cornering
      this.corneringPost = this.game.track
         .availableInteractable as InteractablePost
      this.corneringDuration = 0
      const postPositionFlat = new Vector3(
         this.corneringPost.mesh.position.x,
         0,
         this.corneringPost.mesh.position.z
      )
      const absolutePlayerPos = this.mesh.position
      const playerPositionFlat = new Vector3(
         absolutePlayerPos.x,
         0,
         absolutePlayerPos.z
      )

      this.corneringRadius = Vector3.Distance(
         postPositionFlat,
         playerPositionFlat
      )
      this.corneringStartAngle = Math.atan2(
         playerPositionFlat.x - postPositionFlat.x,
         playerPositionFlat.z - postPositionFlat.z
      )

      this.grapplingLine.startCornering(
         this.mesh.getAbsolutePosition(),
         this.corneringStartAngle,
         this.corneringRadius
      )
   }

   stopCornering() {
      this.mode = PlayerMode.Downhill
      // stop targetting, aim a bit off
      this.targetForceAngle =
         this.forceAngle + this.corneringPost!.directionMultiplier * 0.2
      this.grapplingLine.stopCornering()
      this.corneringPost = null
   }
}
