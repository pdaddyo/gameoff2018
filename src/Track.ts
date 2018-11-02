import GameObject from './GameObject'
import Interactable from './Interactable'
import { Vector3 } from 'babylonjs'
export default class Track extends GameObject {
   interactables = [] as Interactable[]
   currentInteractableIndex = 0
   isCurrentInteractableActive = false

   reset() {
      this.currentInteractableIndex = 0
      this.isCurrentInteractableActive = false
   }

   nextPost() {
      this.currentInteractableIndex++
      this.isCurrentInteractableActive = false
      for (let interactable of this.interactables) {
         interactable.mesh.isVisible = true
      }
   }

   update() {
      const { player } = this.game
      const currentInteractable = this.interactables[
         this.currentInteractableIndex
      ]
      // distance check using squares for performance
      // and ignoring the y to keep things arcady and simple
      const isInRange =
         Vector3.DistanceSquared(
            new Vector3(player.mesh.position.x, 0, player.mesh.position.z),
            new Vector3(
               currentInteractable.mesh.position.x,
               0,
               currentInteractable.mesh.position.z
            )
         ) <= currentInteractable.rangeSquared

      if (!this.isCurrentInteractableActive) {
         if (isInRange) {
            this.isCurrentInteractableActive = true
            currentInteractable.enable()
         }
      } else {
         // currently active
         if (!isInRange) {
            this.isCurrentInteractableActive = false
            currentInteractable.disable()
         }
      }
   }
}
