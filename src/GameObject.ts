import { Scene, AbstractMesh, Mesh, MeshBuilder } from 'babylonjs'
import Game from './Game'

const HIGHLIGHT_COLOR = BABYLON.Color3.Yellow()

export default class GameObject {
   scene: Scene
   game: Game
   mesh = Game.emptyMesh

   constructor() {
      this.game = Game.instance
      this.scene = this.game.scene
      this.game.addGameObject(this)
      this.beforeStart = this.beforeStart.bind(this)
      this.start = this.start.bind(this)
      this.update = this.update.bind(this)
   }

   enableHighlight() {
      //     this.game.highlight.addMesh(this.mesh, HIGHLIGHT_COLOR)
   }

   disableHighlight() {
      //     this.game.highlight.removeMesh(this.mesh)
   }

   beforeStart() {}
   start() {}
   beforeUpdate() {}
   update() {}
}
