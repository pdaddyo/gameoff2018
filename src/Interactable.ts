import GameObject from './GameObject'

export default class Interactable extends GameObject {
   range = 0
   rangeSquared = 0
   enabled = false

   constructor(range: number) {
      super()
      this.range = range
      this.rangeSquared = range * range
   }

   enable() {
      this.enableHighlight()
      this.enabled = true
   }

   disable() {
      this.disableHighlight()
      this.enabled = false
   }
}
