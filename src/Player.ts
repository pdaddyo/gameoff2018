import GameObject from './GameObject'
import { MeshBuilder, Vector3, Ray, Mesh, Color3, Color4 } from 'babylonjs'
import { delay } from 'lodash'
import InteractablePost from './InteractablePost'
import gui from './util/gui'

enum PlayerMode {
   Downhill,
   Cornering,
}

const down = Vector3.Down()

export default class Player extends GameObject {
   mode = PlayerMode.Downhill
   startPosition = new Vector3(0, 3, 0)
   ray: Ray = new Ray(Vector3.Zero(), down)
   mass = 10
   offsetFromGround = 1
   wasTouchingGroundLastFrame = false
   cameraTarget = new Mesh('cameraTarget')
   cameraTargetOffset = new Vector3(0, 0, 0)
   startForceAngle = 0
   forceAngle = 0
   startSpeed = 2.5
   speed = 0
   maxSpeed = 10
   isCornering = false
   corneringRadius = 0
   corneringDuration = 0
   corneringStartAngle = 0
   corneringPost: InteractablePost | null = null
   corneringAcceleration = 0.02
   corneringLine = MeshBuilder.CreateLines(
      'corneringLine',
      {
         points: [Vector3.Zero(), Vector3.Zero()],
         updatable: true,
         colors: [
            Color4.FromHexString('#99a4ccff'),
            Color4.FromHexString('#99a4ccaa'),
         ],
      },
      this.scene
   )
   driftDeadZone = 0

   reset() {
      this.speed = this.startSpeed
      this.forceAngle = this.startForceAngle
      this.mesh.position = new Vector3(0, 3, 0)
   }

   start() {
      this.mesh = MeshBuilder.CreateBox(
         'playerBox',
         { size: 4, width: 2, height: 2 },
         this.scene
      )
      this.mesh.position = this.startPosition
      const { arcCamera, followCamera } = this.game.camera
      if (followCamera) {
         followCamera.lockedTarget = this.cameraTarget
      }
      if (arcCamera) {
         arcCamera.lockedTarget = this.cameraTarget
      }
      this.corneringLine.isVisible = false
      const playerDebugGui = gui.addFolder('Player')
      playerDebugGui.add(this, 'corneringAcceleration', 0, 10)
      playerDebugGui.add(this, 'startSpeed', 0, 10)
      playerDebugGui.add(this, 'speed', 0, 10)
      playerDebugGui.add(this, 'driftDeadZone', 0, 5)
   }

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
            const downhill = Vector3.Cross(across, normal)
            if (!this.wasTouchingGroundLastFrame) {
               this.wasTouchingGroundLastFrame = true
               this.mesh.lookAt(position.add(downhill))
            }

            if (this.mode === PlayerMode.Downhill) {
               // in downhill mode, see how far off the centre of the track and correct a bit
               const nextCentrePoint = this.game.track.getNextCentrePointForTrackY(
                  position.y
               )

               const xOffset = position.x - nextCentrePoint.x
               const zOffset = position.z - nextCentrePoint.z
               const driftAngle = Math.atan2(xOffset, zOffset)
               const absDriftAngle = Math.abs(driftAngle)

               const distanceToNextPoint = Vector3.DistanceSquared(
                  position,
                  nextCentrePoint
               )
               let adjustAngle = 0

               if (absDriftAngle > this.driftDeadZone) {
                  if (driftAngle > 0) {
                     //    adjustAngle = (distanceToNextPoint / 20000) * deltaTime
                  } else {
                     //     adjustAngle = -(distanceToNextPoint / 20000) * deltaTime
                  }

                  this.forceAngle += adjustAngle / 20
                  //  console.log(driftAngle)
               } else {
                  this.forceAngle = driftAngle
               }

               //               position.x += xOffset / 10
               //              position.z += zOffset / 10

               position.x +=
                  (Math.sin(this.forceAngle + adjustAngle) *
                     this.speed *
                     deltaTime) /
                  100
               position.z +=
                  (Math.cos(this.forceAngle + adjustAngle) *
                     this.speed *
                     deltaTime) /
                  100
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

               this.corneringLine = MeshBuilder.CreateLines('corneringLine', {
                  points: [
                     new Vector3(
                        this.game.track.availableInteractable!.mesh.position.x,
                        this.mesh.position.y,
                        this.game.track.availableInteractable!.mesh.position.z
                     ),
                     this.mesh.position,
                  ],
                  instance: this.corneringLine,
               })
               this.speed += (this.corneringAcceleration * deltaTime) / 1000
               this.forceAngle =
                  angle +
                  (this.corneringPost!.directionMultiplier * Math.PI) / 2
            }
            // pin y to floor
            position.y = result.pickedPoint!.y + this.offsetFromGround
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
      this.corneringLine.isVisible = true
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
   }

   stopCornering() {
      this.mode = PlayerMode.Downhill
      this.corneringLine.isVisible = false
      this.corneringPost = null
   }
}
