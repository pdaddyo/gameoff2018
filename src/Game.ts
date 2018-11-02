import {
   Engine,
   Scene,
   Vector3,
   FollowCamera,
   Light,
   DirectionalLight,
   Color3,
   Color4,
   ShadowGenerator,
   HemisphericLight,
   ArcRotateCamera,
   Camera,
} from 'babylonjs'

import Snow from './Snow'
import Track from './Track'
import GameObject from './GameObject'
import Player from './Player'

export default class Game {
   static instance: Game
   private canvas: HTMLCanvasElement
   scene: Scene
   engine: Engine
   camera: FollowCamera
   light: Light
   player: Player
   track: Track
   isPointerDown: boolean = false
   gameObjects: GameObject[] = [] as GameObject[]

   constructor(canvas: HTMLCanvasElement) {
      Game.instance = this
      this.canvas = canvas
      this.engine = new Engine(canvas, true)
      this.scene = this.setupScene()
      this.player = new Player()
      this.camera = this.setupCamera()
      this.light = this.setupLights()
      this.setupRenderPipeline()
      this.setupDebug()
      this.setupResize()
      this.track = new Track()
      new Snow()
   }

   addGameObject(gameObject: GameObject) {
      this.gameObjects.push(gameObject)
   }

   start() {
      this.startGameObjects()
      this.setupRenderLoop()
   }

   startGameObjects() {
      for (let gameObject of this.gameObjects) {
         gameObject.start()
      }
   }

   private setupRenderLoop() {
      this.engine.runRenderLoop(() => {
         this.scene.render()
      })
   }

   private setupScene() {
      const scene = new Scene(this.engine)
      scene.clearColor = Color4.FromHexString('#77ccecff')
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

   private setupLights() {
      this.scene.ambientColor = Color3.FromHexString('#99a4cc')

      const hemi = new HemisphericLight(
         'lighthemi',
         new Vector3(0, 0.5, 1),
         this.scene
      )
      hemi.intensity = 0.95
      hemi.groundColor = Color3.FromHexString('#8894bc')

      const light = new DirectionalLight(
         'light1',
         new Vector3(-1, -1, 0),
         this.scene
      )
      light.shadowEnabled = true
      light.position = new Vector3(50, 30, -50)
      light.diffuse = new Color3(1, 0.97, 0.97)
      light.specular = Color3.FromHexString('#99a4cc')
      light.intensity = 0.94

      //   light.includedOnlyMeshes.push(this.playerMesh, this.ground)
      const shadowGenerator = new ShadowGenerator(512, light)
      shadowGenerator.getShadowMap()!.renderList!.push(this.player.mesh!)
      shadowGenerator.useBlurExponentialShadowMap = true
      shadowGenerator.blurBoxOffset = 4
      shadowGenerator.normalBias = 0.1
      shadowGenerator.setDarkness(0.5)
      return light
   }

   private setupFollowCamera() {
      const camera = new FollowCamera(
         'Camera',
         new Vector3(-10, 10, 10),
         this.scene,
         this.player.mesh
      )
      camera.radius = 60
      camera.heightOffset = 100
      camera.rotationOffset = 100
      camera.cameraAcceleration = 0.1
      camera.maxCameraSpeed = 7

      camera.lockedTarget = this.player.mesh!
      camera.attachControl(this.canvas, true)

      return camera
   }

   private setupArcCamera() {
      const camera = new ArcRotateCamera(
         'Camera',
         Math.PI / 1.5,
         Math.PI / 4,
         120,
         new Vector3(0, -40, 0),
         this.scene
      )

      camera.attachControl(this.canvas, true)

      return camera
   }

   private setupCamera() {
      //return this.setupArcCamera()
      return this.setupFollowCamera()
   }

   private setupRenderPipeline() {
      const pipeline = new BABYLON.DefaultRenderingPipeline(
         'pipeline',
         true,
         this.scene,
         [this.camera]
      )

      pipeline.fxaaEnabled = false
      pipeline.bloomEnabled = true
      pipeline.bloomWeight = 0.05
      pipeline.bloomScale = 0.1
      pipeline.imageProcessingEnabled = true
      pipeline.imageProcessing.vignetteEnabled = true
      pipeline.imageProcessing.vignetteBlendMode =
         BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY
      pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 0.9)
      pipeline.imageProcessing.vignetteWeight = 1.5
      //pipeline.imageProcessing.toneMappingEnabled = true
      pipeline.imageProcessing.colorCurvesEnabled = true
      pipeline.imageProcessing.contrast = 1
      pipeline.imageProcessing.exposure = 1
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
}
