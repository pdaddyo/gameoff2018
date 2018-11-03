import GameObject from './GameObject'
import Interactable from './Interactable'
import { Vector3 } from 'babylonjs'
export default class Track extends GameObject {
   interactables = [] as Interactable[]
   currentInteractableIndex = 0
   availableInteractable: Interactable | null = null

   reset() {
      this.currentInteractableIndex = 0
      this.availableInteractable = null
      for (let interactable of this.interactables) {
         interactable.mesh.isVisible = true
      }
   }

   nextInteractable() {
      const currentInteractable = this.interactables[
         this.currentInteractableIndex
      ]
      currentInteractable.disable()
      this.currentInteractableIndex++
      this.availableInteractable = null
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

      if (!this.availableInteractable) {
         if (isInRange) {
            this.availableInteractable = currentInteractable
            currentInteractable.enable()
         }
      } else {
         // currently active
         if (!isInRange) {
            this.nextInteractable()
         }
      }
   }
}
