import Game from './Game'
import {
   ImageProcessingConfiguration,
   DefaultRenderingPipeline,
} from 'babylonjs'

export default class RenderPipeline {
   constructor(game: Game) {
      const pipeline = new DefaultRenderingPipeline(
         'pipeline',
         true,
         game.scene,
         [game.camera.activeCamera]
      )

      pipeline.fxaaEnabled = false
      pipeline.bloomEnabled = false
      //pipeline.bloomWeight = 0.05
      //pipeline.bloomScale = 0.1
      pipeline.imageProcessingEnabled = true
      pipeline.imageProcessing.vignetteEnabled = true
      pipeline.imageProcessing.vignetteBlendMode =
         ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY
      pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0, 0, 0, 0.9)
      pipeline.imageProcessing.vignetteWeight = 1.5
      //pipeline.imageProcessing.toneMappingEnabled = true
      pipeline.imageProcessing.colorCurvesEnabled = true
      pipeline.imageProcessing.contrast = 1
      pipeline.imageProcessing.exposure = 1
   }
}
