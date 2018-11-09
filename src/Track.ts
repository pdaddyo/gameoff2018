import GameObject from './GameObject'
import Interactable from './Interactable'
import { Vector3 } from 'babylonjs'
import InteractablePost from './InteractablePost'
export default class Track extends GameObject {
   interactables = [] as Interactable[]
   currentInteractableIndex = 0
   availableInteractable: Interactable | null = null
   centrePath = [] as Vector3[]
   centrePathIndex = 0
   reset() {
      this.currentInteractableIndex = 0
      this.centrePathIndex = 0
      this.availableInteractable = null
      for (let interactable of this.interactables) {
         interactable.disable()
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

   getNextCentrePointForTrackY(y: number) {
      while (this.centrePath[this.centrePathIndex].y > y) {
         this.centrePathIndex++
         //end of the list?
         if (this.centrePathIndex === this.centrePath.length) {
            return Vector3.Zero()
         }
      }
      return this.centrePath[this.centrePathIndex]
   }

   update() {
      const { player } = this.game
      const playerPosition = player.mesh.position
      const currentInteractable = this.interactables[
         this.currentInteractableIndex
      ] as InteractablePost
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
         if (
            isInRange &&
            playerPosition.y - player.offsetFromGround <=
               currentInteractable.cornerStartY
         ) {
            this.availableInteractable = currentInteractable
            currentInteractable.enable()
         }
      } else {
         // currently active
         if (!isInRange || playerPosition.y <= currentInteractable.cornerEndY) {
            this.nextInteractable()
         }
      }
   }
}
