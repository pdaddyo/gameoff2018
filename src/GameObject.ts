import { Scene, AbstractMesh } from 'babylonjs'
import Game from './Game'

export default class GameObject {
   scene: Scene
   mesh?: AbstractMesh
   game: Game

   constructor() {
      this.game = Game.instance
      this.scene = this.game.scene
      this.game.addGameObject(this)
      this.beforeStart = this.beforeStart.bind(this)
      this.start = this.start.bind(this)
      this.update = this.update.bind(this)
   }

   beforeStart() {}
   start() {}
   beforeUpdate() {}
   update() {}
}
