import Game from './Game'
import {
   Color3,
   HemisphericLight,
   Vector3,
   DirectionalLight,
   ShadowGenerator,
   Color4,
   AbstractMesh,
} from 'babylonjs'
import gui from './util/gui'

export default class Lighting {
   offset: Vector3 = new Vector3(20, 20, 0)
   light: DirectionalLight
   game: Game
   constructor(game: Game) {
      const { scene, player } = game
      scene.ambientColor = Color3.FromHexString('#99a4cc')
      scene.clearColor = Color4.FromHexString('#27acfcff')

      const hemi = new HemisphericLight(
         'lighthemi',
         new Vector3(0, 0.5, 1),
         scene
      )
      hemi.intensity = 0.84
      hemi.groundColor = Color3.FromHexString('#8894bc')

      const light = new DirectionalLight(
         'light1',
         new Vector3(-0.45, -0.7, 0.3),
         scene
      )
      light.shadowEnabled = true
      light.diffuse = new Color3(1, 0.97, 0.97)
      light.specular = Color3.FromHexString('#99a4cc')
      light.intensity = 0.36

      this.light = light
      this.game = game
      const lightGui = gui.addFolder('Lighting')
      lightGui.add(hemi, 'intensity', 0, 10)
      lightGui.add(light, 'intensity', 0, 10)
      lightGui.add(light.direction, 'x', -0.99, 0.99)
      lightGui.add(light.direction, 'y', -0.99, 0.99)
      lightGui.add(light.direction, 'z', -0.99, 0.99)
   }

   ready(meshes: AbstractMesh[]) {
      const shadowGenerator = new ShadowGenerator(512, this.light)
      this.light.includedOnlyMeshes.push(this.game.track.mesh, ...meshes)
      shadowGenerator.getShadowMap()!.renderList!.push(...meshes)
      shadowGenerator.useBlurExponentialShadowMap = true
      shadowGenerator.blurBoxOffset = 2
      shadowGenerator.normalBias = 0.1
      shadowGenerator.setDarkness(0.4)
   }
}
