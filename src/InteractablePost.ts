import GameObject from './GameObject'
import Interactable from './Interactable'
import { MeshBuilder, Vector3, Mesh } from 'babylonjs'

export default class InteractablePost extends Interactable {
   height = 10
   directionMultiplier = 0
   wasRotatingLastFrame = false
   constructor(
      postIndex: number,
      position: Vector3,
      range: number,
      directionMultiplier: number
   ) {
      super(range)
      this.directionMultiplier = directionMultiplier
      this.mesh = MeshBuilder.CreateCylinder(
         `post${postIndex}`,
         { height: 8, diameterTop: 1, diameterBottom: 4 },
         this.scene
      )
      this.mesh.position = position.add(new Vector3(0, this.height / 2, 0))
   }

   start() {}

   update() {
      if (this.enabled && this.game.isPointerDown) {
         this.wasRotatingLastFrame = true
         const angleDelta =
            ((this.game.deltaTime * this.range * this.game.player.speed) /
               20000) *
            this.directionMultiplier

         this.game.player.forceAngle -= angleDelta
      } else {
         if (this.wasRotatingLastFrame) {
            this.disable()
            this.mesh.isVisible = false
            this.game.track.nextPost()
            this.wasRotatingLastFrame = false
         }
      }
   }
}
