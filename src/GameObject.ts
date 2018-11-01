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
      this.start = this.start.bind(this)
      this.update = this.update.bind(this)
      this.scene.registerBeforeRender(this.update)
   }

   start() {}
   protected update(): void {}
}
