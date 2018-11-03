import Game from './Game'
import {
   Color3,
   HemisphericLight,
   Vector3,
   DirectionalLight,
   ShadowGenerator,
   Color4,
} from 'babylonjs'
import gui from './util/gui'

export default class Lighting {
   offset: Vector3 = new Vector3(20, 20, 0)
   constructor(game: Game) {
      const { scene, player } = game
      scene.ambientColor = Color3.FromHexString('#99a4cc')
      scene.clearColor = Color4.FromHexString('#57ccfcff')

      const hemi = new HemisphericLight(
         'lighthemi',
         new Vector3(0, 0.5, 1),
         scene
      )
      hemi.intensity = 0.95
      hemi.groundColor = Color3.FromHexString('#8894bc')

      const light = new DirectionalLight(
         'light1',
         new Vector3(-1, -1, 0.2),
         scene
      )
      light.shadowEnabled = true
      light.diffuse = new Color3(1, 0.97, 0.97)
      light.specular = Color3.FromHexString('#99a4cc')
      light.intensity = 0.34

      //   light.includedOnlyMeshes.push(this.playerMesh, this.ground)
      const shadowGenerator = new ShadowGenerator(512, light)
      shadowGenerator.getShadowMap()!.renderList!.push(player.mesh)
      shadowGenerator.useBlurExponentialShadowMap = true
      shadowGenerator.blurBoxOffset = 4
      shadowGenerator.normalBias = 0.1
      shadowGenerator.setDarkness(0.5)

      const lightGui = gui.addFolder('Lighting')
      lightGui.add(hemi, 'intensity', 0, 10)
      lightGui.add(light, 'intensity', 0, 10)
   }
}
