import { Engine, Scene } from 'babylonjs'

import Snow from './Snow'
import Track from './Track'
import GameObject from './GameObject'
import Player from './Player'
import RenderPipeline from './RenderPipeline'
import Lighting from './Lighting'
import Camera from './Camera'

export default class Game {
   static instance: Game
   canvas: HTMLCanvasElement
   scene: Scene
   engine: Engine
   camera: Camera
   lighting: Lighting
   player: Player
   track: Track
   isPointerDown = false
   gameObjects = [] as GameObject[]
   pipeline: RenderPipeline
   snow: Snow
   isPlaying = true

   constructor(canvas: HTMLCanvasElement) {
      Game.instance = this
      this.canvas = canvas
      this.engine = new Engine(canvas, true)
      this.scene = this.setupScene()
      this.setupDebug()
      this.setupResize()
      this.player = new Player()
      this.camera = new Camera(this)
      this.lighting = new Lighting(this)
      this.pipeline = new RenderPipeline(this)
      this.track = new Track()
      this.snow = new Snow()
   }

   start() {
      this.startGameObjects()
      this.setupRenderLoop()
   }

   startGameObjects() {
      for (let gameObject of this.gameObjects) {
         gameObject.beforeStart()
      }
      for (let gameObject of this.gameObjects) {
         gameObject.start()
      }
   }

   private setupRenderLoop() {
      this.engine.runRenderLoop(() => {
         this.updateGameObjects()
         this.scene.render()
      })
   }

   updateGameObjects() {
      for (let gameObject of this.gameObjects) {
         gameObject.beforeUpdate()
      }
      for (let gameObject of this.gameObjects) {
         gameObject.update()
      }
   }

   private setupScene() {
      const scene = new Scene(this.engine)
      scene.onPointerDown = evt => {
         evt.preventDefault()
         this.isPointerDown = true
      }
      scene.onPointerUp = evt => {
         evt.preventDefault()
         this.isPointerDown = false
      }
      return scene
   }

   private setupDebug() {
      const { scene } = this
      const button = document.getElementById('enableDebug')
      if (button) {
         button.addEventListener('click', () => {
            if (scene) {
               const { debugLayer } = scene
               if (debugLayer.isVisible()) {
                  debugLayer.hide()
               } else {
                  debugLayer.show()
               }
            }
         })
      }
   }

   private setupResize() {
      window.addEventListener('resize', () => {
         this.engine.resize()
      })
   }

   addGameObject(gameObject: GameObject) {
      this.gameObjects.push(gameObject)
   }
}
