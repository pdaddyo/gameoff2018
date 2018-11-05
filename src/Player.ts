import GameObject from './GameObject'
import { Vector3, Ray, Mesh, SceneLoader, AbstractMesh } from 'babylonjs'
import { delay } from 'lodash'
import InteractablePost from './InteractablePost'
import gui from './util/gui'
import GrapplingLine from './GrapplingLine'

enum PlayerMode {
   Downhill,
   Cornering,
}

const down = Vector3.Down()

export default class Player extends GameObject {
   mode = PlayerMode.Downhill
   startPosition = new Vector3(0, 3, 0)
   grapplingLine = new GrapplingLine()
   ray: Ray = new Ray(Vector3.Zero(), down)
   offsetFromGround = 1.1
   wasTouchingGroundLastFrame = false
   cameraTarget = new Mesh('cameraTarget')
   cameraTargetOffset = new Vector3(0, 0, 0)
   startForceAngle = 0
   forceAngle = 0
   targetForceAngle = 0
   startSpeed = 2.5
   speed = 0
   maxSpeed = 10
   isCornering = false
   corneringRadius = 0
   corneringDuration = 0
   corneringStartAngle = 0
   corneringPost: InteractablePost | null = null
   corneringAcceleration = 0.02
   driftDeadZone = 0

   reset() {
      this.speed = this.startSpeed
      this.targetForceAngle = this.forceAngle = this.startForceAngle
      this.mesh.position = new Vector3(0, 3, 0)
      this.mesh.rotation.set(0, 0, 0)
   }

   createMaterial() {
      const material = new BABYLON.StandardMaterial(
         'playerMaterial',
         this.scene
      )
      material.diffuseColor = new BABYLON.Color3(0.2, 0.7, 0.99)
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
            for (let mesh of newMeshes) {
               if (index++ > 4) continue
               mesh.parent = this.mesh
               mesh.material = material
               // mesh.rotate(Axis.Y, Math.PI)
            }

            this.mesh.scaling = new Vector3(1.5, 1.5, 1.5)

            // Set the target of the camera to the first imported mesh
            //this.mesh = newMeshes[3]
         }
      )
      /* this.mesh = MeshBuilder.CreateBox(
         'playerBox',
         { size: 4, width: 2, height: 2 },
         this.scene
      )*/
      this.mesh.position = this.startPosition
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
      playerDebugGui.add(this.mesh.rotation, 'x', -8, 8)
      playerDebugGui.add(this.mesh.rotation, 'y', -8, 8)
      playerDebugGui.add(this.mesh.rotation, 'z', -8, 8)
   }

   private lookTowardsDeltaTime = 0
   private lookTowardsCurrent = Vector3.Zero()
   private lookTowardsTarget: Vector3 | null = null
   lookTowardsSpeed = 150

   lookTowards(current: Vector3, target: Vector3) {
      this.lookTowardsDeltaTime = 0
      this.lookTowardsCurrent = current
      this.lookTowardsTarget = target
   }

   updateLookTowards() {
      if (this.lookTowardsTarget) {
         this.lookTowardsDeltaTime += this.game.deltaTime
         if (this.lookTowardsDeltaTime > this.lookTowardsSpeed) {
            this.lookTowardsCurrent = this.lookTowardsTarget
            this.mesh.lookAt(this.mesh.position.add(this.lookTowardsTarget))
            this.lookTowardsTarget = null
            return
         }
         this.mesh.lookAt(
            this.mesh.position.add(
               Vector3.Lerp(
                  this.lookTowardsCurrent,
                  this.lookTowardsTarget,
                  this.lookTowardsDeltaTime / this.lookTowardsSpeed
               )
            )
         )
      }
   }

   private lastDownhillVector?: Vector3

   update() {
      const { deltaTime } = this.game
      const { position } = this.mesh

      if (this.game.isPlaying) {
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
            const trackAngle = Math.atan2(downhillVector.x, downhillVector.z)

            if (!this.lastDownhillVector) {
               this.lastDownhillVector = downhillVector
               //      this.lookTowards(this.lastDownhillVector, downhillVector)
            }

            // has the downward vector changed enough?
            if (
               this.lastDownhillVector &&
               !this.lastDownhillVector.equalsWithEpsilon(downhillVector, 0.01)
            ) {
               //      this.lookTowards(this.lastDownhillVector, downhillVector)
               this.lastDownhillVector = downhillVector
            }
            this.updateLookTowards()
            // pin y to floor
            position.y = result.pickedPoint!.y + this.offsetFromGround

            if (this.mode === PlayerMode.Downhill) {
               this.targetForceAngle = trackAngle
               position.x +=
                  (Math.sin(this.forceAngle) * this.speed * deltaTime) / 100
               position.z +=
                  (Math.cos(this.forceAngle) * this.speed * deltaTime) / 100
            }

            if (this.mode === PlayerMode.Cornering) {
               this.corneringDuration += this.game.deltaTime
               const angle =
                  this.corneringStartAngle +
                  (this.corneringPost!.directionMultiplier *
                     this.corneringDuration *
                     (12 / this.corneringRadius) *
                     (this.speed / 10)) /
                     124
               position.x =
                  this.corneringPost!.mesh.position.x +
                  Math.sin(angle) * this.corneringRadius
               position.z =
                  this.corneringPost!.mesh.position.z +
                  Math.cos(angle) * this.corneringRadius

               this.speed += (this.corneringAcceleration * deltaTime) / 1000

               this.targetForceAngle =
                  angle +
                  (this.corneringPost!.directionMultiplier * Math.PI) / 2
               while (this.targetForceAngle > Math.PI) {
                  this.targetForceAngle -= Math.PI * 2
               }

               while (this.targetForceAngle < -Math.PI) {
                  this.targetForceAngle += Math.PI * 2
               }

               this.grapplingLine.updateCornering(this.mesh.position.y, angle)
            }

            // head towards target angle
            const angleDelta = this.targetForceAngle - this.forceAngle
            this.forceAngle +=
               (angleDelta * deltaTime) /
               (this.mode === PlayerMode.Downhill ? 600 : 320)

            this.mesh.rotation.y = this.forceAngle
         } else {
            console.log('game over')
            this.speed = 0
            this.game.isPlaying = false
            // no ground beneath us, round fail for now
            delay(() => {
               this.game.reset()
            }, 500)
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
      const playerPositionFlat = new Vector3(
         this.mesh.position.x,
         0,
         this.mesh.position.z
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
         this.corneringPost,
         this.corneringStartAngle,
         this.corneringRadius
      )
   }

   stopCornering() {
      this.mode = PlayerMode.Downhill
      this.grapplingLine.stopCornering()
      this.corneringPost = null
   }
}
