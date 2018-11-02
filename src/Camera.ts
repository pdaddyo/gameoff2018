import Game from './Game'
import { FollowCamera, Vector3, ArcRotateCamera } from 'babylonjs'
import * as BABYLON from 'babylonjs'
import gui from './util/gui'

export default class Camera {
   game: Game
   followCamera?: FollowCamera
   arcCamera?: ArcRotateCamera
   activeCamera: BABYLON.Camera
   constructor(game: Game) {
      this.game = game

      this.followCamera = this.setupFollowCamera()
      this.activeCamera = this.followCamera

      //this.arcCamera = this.setupArcCamera()
      //this.activeCamera = this.arcCamera
   }

   private setupFollowCamera() {
      const { scene, player, canvas } = this.game

      const camera = new FollowCamera(
         'Camera',
         new Vector3(-10, 10, 10),
         scene,
         player.mesh
      )
      camera.radius = 40
      camera.heightOffset = 98
      camera.rotationOffset = -20 //-90
      camera.cameraAcceleration = 0.05
      camera.maxCameraSpeed = 7
      var cameraGui = gui.addFolder('Camera')
      cameraGui.add(camera, 'radius', 0, 50)
      cameraGui.add(camera, 'heightOffset', 10, 220)
      cameraGui.add(camera, 'rotationOffset', -180, 180)

      camera.attachControl(canvas, true)

      return camera
   }

   private setupArcCamera() {
      const { scene, canvas } = this.game

      const camera = new ArcRotateCamera(
         'Camera',
         -Math.PI,
         Math.PI / 8,
         100,
         new Vector3(0, -40, 0),
         scene
      )

      camera.attachControl(canvas, true)

      return camera
   }
}
