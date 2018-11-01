import GameObject from './GameObject'
import {
   MeshBuilder,
   Vector3,
   Ray,
   Mesh,
   RayHelper,
   Color3,
   Space,
} from 'babylonjs'

const down = Vector3.Down()
const touchingDistance = 0.3
const terminalVelocity = 2
const gravity = new Vector3(0, -9.81, 0)

export default class Player extends GameObject {
   velocity: Vector3 = Vector3.Zero()
   ray: Ray = new Ray(Vector3.Zero(), down)
   mass = 10

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
         const distanceToFloor = result.distance
         if (distanceToFloor <= touchingDistance) {
            // touching floor
            this.velocity = Vector3.Zero()
            console.log('touching ground!')
         } else {
            console.log('mid air!', this.velocity)
            // mid air, just apply gravity
            this.velocity.addInPlace(
               gravity.scale((this.mass / 1000000) * delta)
            )
         }

         const normal = result.getNormal(true, true)!
         this.mesh!.lookAt(position.add(normal))

         this.mesh!.translate(
            this.velocity.normalizeToNew(),
            this.velocity.length(),
            Space.WORLD
         )
      }
   }
}
