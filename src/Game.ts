import { Engine, Scene, HighlightLayer, Mesh, Vector3 } from 'babylonjs'

import Snow from './Snow'
import Track from './Track'
import GameObject from './GameObject'
import Player from './Player'
import RenderPipeline from './RenderPipeline'
import Lighting from './Lighting'
import Camera from './Camera'
import TrackBuilder from './TrackBuilder'
import demoTrack from './util/demoTrack'

export default class Game {
   static instance: Game
   static emptyMesh: Mesh
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
   isPlaying = false
   highlight: HighlightLayer
   deltaTime = 1

   constructor(canvas: HTMLCanvasElement) {
      Game.instance = this
      this.canvas = canvas
      this.engine = new Engine(canvas, true, { stencil: true })
      this.scene = this.setupScene()
      Game.emptyMesh = new Mesh('empty')
      this.highlight = new HighlightLayer('hl1', this.scene)
      this.setupDebug()
      this.setupResize()
      this.player = new Player()
      this.camera = new Camera(this)
      this.lighting = new Lighting(this)
      this.pipeline = new RenderPipeline(this)
      this.track = new TrackBuilder(this.scene).createTrack([
         ...demoTrack,
         ...demoTrack,
         ...demoTrack,
      ])
      this.snow = new Snow()
   }

   start() {
      this.startGameObjects()
      this.setupRenderLoop()
   }

   reset() {
      const { player } = this
      player.speed = player.startSpeed
      player.forceAngle = player.startForceAngle
      player.mesh.position = new Vector3(0, 3, 0)
      this.track.reset()
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
      this.deltaTime = this.engine.getDeltaTime()
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
         if (!this.isPlaying) {
            this.reset()
            this.isPlaying = true
         }
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
