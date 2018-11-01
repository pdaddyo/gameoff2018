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
} from 'babylonjs'

const down = Vector3.Down()
const touchingDistance = 1
const terminalVelocity = 2
const gravity = new Vector3(0, -9.81, 0)

export default class Player extends GameObject {
   velocity: Vector3 = Vector3.Zero()
   ray: Ray = new Ray(Vector3.Zero(), down)
   mass = 10
   wasTouchingGroundLastFrame = false
   transformNode: TransformNode = new TransformNode('playerTransformHelper')

   start() {
      this.mesh = MeshBuilder.CreateBox(
         'playerBox',
         { size: 4, width: 2, height: 2 },
         this.scene
      )
      this.mesh.setPositionWithLocalVector(new Vector3(0, 5, 2))
      //this.mesh.position.y = 5
      //this.mesh.position.z = 2
   }

   update() {
      const delta = this.game.engine.getDeltaTime()
      const { position } = this.mesh!
      this.ray.origin = position
      this.ray.direction = down
      const result = this.ray.intersectsMesh(this.game.track.mesh!, false)
      if (result.hit) {
         const normal = result.getNormal(true, true)!
         this.mesh!.lookAt(position.add(normal))
         const across = Vector3.Cross(normal, Vector3.Down())
         const downhill = Vector3.Cross(across, normal)
         const distanceToFloor = result.distance
         if (distanceToFloor <= touchingDistance) {
            if (!this.wasTouchingGroundLastFrame) {
               this.wasTouchingGroundLastFrame = true
               // just touching for first time, convert
               //   console.log('touched ground!')
            }
            this.velocity = downhill.scale(1)
            // touching ground
         } else {
            this.wasTouchingGroundLastFrame = false
            //  console.log('mid air!', this.velocity)
            // mid air, just apply gravity
            this.velocity.addInPlace(
               gravity.scale((this.mass / 1000000) * delta)
            )
         }

         //
         this.mesh!.position.addInPlace(this.velocity)
      }
   }
}
