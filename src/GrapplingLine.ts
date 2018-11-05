import GameObject from './GameObject'
import {
   MeshBuilder,
   Vector3,
   StandardMaterial,
   Color4,
   Color3,
} from 'babylonjs'
import InteractablePost from './InteractablePost'

export default class GrapplingLine extends GameObject {
   beforeStart() {
      this.mesh = MeshBuilder.CreateBox(
         'GrapplingLine',
         {
            height: 1,
            width: 0.2,
            depth: 0.2,
         },
         this.scene
      )
      this.mesh.material = this.createMaterial()
      this.mesh.setPivotPoint(new Vector3(0, -0.5, 0))
      this.mesh.isVisible = false
      this.mesh.rotation.x = Math.PI / 2
   }

   createMaterial() {
      const material = new BABYLON.StandardMaterial('grapplingLine', this.scene)
      material.disableLighting = true
      //   material.emissiveColor = Color3.White()
      material.emissiveColor = Color3.FromHexString('#37bcfa')
      return material
   }

   startCornering(post: InteractablePost, angle: number, radius: number) {
      this.mesh.isVisible = true
      this.mesh.position = post.mesh.position.clone()
      this.mesh.rotation.y = angle
      this.mesh.scaling.y = radius
      this.enableHighlight()
   }

   updateCornering(y: number, angle: number) {
      this.mesh.position.y = y + 0.5
      this.mesh.rotation.y = angle
   }

   stopCornering() {
      this.disableHighlight()
      this.mesh.isVisible = false
   }
}
