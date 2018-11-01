import * as BABYLON from 'babylonjs'

export const createAxisWidget = scene => {
   var faceColors = []
   faceColors[0] = BABYLON.Color3.Blue()
   faceColors[1] = BABYLON.Color3.White()
   faceColors[2] = BABYLON.Color3.Red()
   faceColors[3] = BABYLON.Color3.Black()
   faceColors[4] = BABYLON.Color3.Green()
   faceColors[5] = BABYLON.Color3.Yellow()

   var box = BABYLON.MeshBuilder.CreateBox(
      'Box',
      { faceColors: faceColors, size: 2 },
      scene
   )
   box.material = new BABYLON.StandardMaterial('', scene)

   /*******************End Box Creation*****************************************/

   /***********Create and Draw Axes**************************************/
   var showAxis = function(size) {
      var makeTextPlane = function(text, color, size) {
         var dynamicTexture = new BABYLON.DynamicTexture(
            'DynamicTexture',
            50,
            scene,
            true
         )
         dynamicTexture.hasAlpha = true
         dynamicTexture.drawText(
            text,
            5,
            40,
            'bold 36px Arial',
            color,
            'transparent',
            true
         )
         var plane = BABYLON.Mesh.CreatePlane('TextPlane', size, scene)
         const material = new BABYLON.StandardMaterial(
            'TextPlaneMaterial',
            scene
         )
         material.backFaceCulling = false
         material.specularColor = new BABYLON.Color3(0, 0, 0)
         material.diffuseTexture = dynamicTexture
         plane.material = material
         return plane
      }

      var axisX = BABYLON.Mesh.CreateLines(
         'axisX',
         [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
         ],
         scene
      )
      axisX.color = new BABYLON.Color3(1, 0, 0)
      var xChar = makeTextPlane('X', 'red', size / 10)
      xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
      var axisY = BABYLON.Mesh.CreateLines(
         'axisY',
         [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
         ],
         scene
      )
      axisY.color = new BABYLON.Color3(0, 1, 0)
      var yChar = makeTextPlane('Y', 'green', size / 10)
      yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)
      var axisZ = BABYLON.Mesh.CreateLines(
         'axisZ',
         [
            BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
         ],
         scene
      )
      axisZ.color = new BABYLON.Color3(0, 0, 1)
      var zChar = makeTextPlane('Z', 'blue', size / 10)
      zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
   }

   return showAxis(6)
}
