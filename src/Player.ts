import GameObject from './GameObject'
import {
   MeshBuilder,
   Vector3,
   Ray,
   Mesh,
   RayHelper,
   Color3,
   Space,
   Quaternion,
   TransformNode,
   Axis,
   FollowCamera,
} from 'babylonjs'
import { delay } from 'lodash'

const down = Vector3.Down()

export default class Player extends GameObject {
   startPosition: Vector3 = Vector3.Zero()
   ray: Ray = new Ray(Vector3.Zero(), down)
   mass = 10
   offsetFromGround = 1
   wasTouchingGroundLastFrame = false
   cameraTarget = new Mesh('cameraTarget')
   cameraTargetOffset = new Vector3(0, -20, 0)
   startForceAngle = 0
   forceAngle = 0
   startSpeed = 2
   speed = 0
   maxSpeed = 10

   start() {
      this.mesh = MeshBuilder.CreateBox(
         'playerBox',
         { size: 4, width: 2, height: 2 },
         this.scene
      )
      this.mesh.setPositionWithLocalVector(new Vector3(0, 5, 2))
      this.startPosition = this.mesh.position
      const { arcCamera, followCamera } = this.game.camera
      if (followCamera) {
         followCamera.lockedTarget = this.cameraTarget
      }
      if (arcCamera) {
         arcCamera.lockedTarget = this.cameraTarget
      }

      this.reset()
   }

   reset() {
      this.speed = this.startSpeed
      this.forceAngle = this.startForceAngle
      this.mesh!.position = Vector3.Zero()
      this.game.isPlaying = true
   }

   beforeUpdate() {
      this.cameraTarget.position = this.mesh!.position.add(
         this.cameraTargetOffset
      )
   }

   update() {
      const delta = this.game.engine.getDeltaTime()
      const { position } = this.mesh!

      if (!this.game.isPlaying) {
         return
      }

      this.ray.origin = position
      this.ray.direction = down
      const result = this.ray.intersectsMesh(this.game.track.mesh!, false)
      if (result.hit) {
         const normal = result.getNormal(true, true)!
         const across = Vector3.Cross(normal, Vector3.Down())
         const downhill = Vector3.Cross(across, normal)
         if (!this.wasTouchingGroundLastFrame) {
            this.wasTouchingGroundLastFrame = true
            this.mesh!.lookAt(position.add(downhill))
         }
         // glue to floor
         position.y = result.pickedPoint!.y + this.offsetFromGround
      } else {
         console.log('game over')
         this.speed = 0
         this.game.isPlaying = false
         // no ground beneath us, round fail for now
         delay(() => {
            this.reset()
         }, 500)
      }
      position.x -= ((Math.sin(this.forceAngle) * this.speed) / 100) * delta
      position.z += ((Math.cos(this.forceAngle) * this.speed) / 100) * delta
   }
}
