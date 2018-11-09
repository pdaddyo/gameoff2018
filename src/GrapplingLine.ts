import GameObject from './GameObject'
import {
   MeshBuilder,
   Vector3,
   StandardMaterial,
   Color4,
   Color3,
} from 'babylonjs'
import InteractablePost from './InteractablePost'
import gui from './util/gui'

export default class GrapplingLine extends GameObject {
   extension = 0
   extendSpeed = 0.0075
   radius = 0

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

      this.setupDebugGui()
   }

   createMaterial() {
      const material = new BABYLON.StandardMaterial('grapplingLine', this.scene)
      material.disableLighting = true
      //   material.emissiveColor = Color3.White()
      material.emissiveColor = Color3.FromHexString('#37bcfa')
      return material
   }

   private setupDebugGui() {
      const grappleDebugGui = gui.addFolder('Grapple')
      grappleDebugGui.add(this, 'extendSpeed', 0.001, 0.05)
   }

   startCornering(position: Vector3, angle: number, radius: number) {
      this.mesh.isVisible = false ///true
      this.mesh.position = position
      this.mesh.rotation.y = Math.PI + angle
      this.mesh.scaling.y = 0
      this.extension = 0
      this.radius = radius
      //this.enableHighlight()
   }

   updateCornering(position: Vector3, angle: number, deltaTime: number) {
      this.mesh.position = position
      this.mesh.position.y += 2.5
      this.mesh.rotation.y = Math.PI + angle
      if (this.extension < 1.0) {
         this.extension = Math.min(
            1.0,
            this.extension + this.extendSpeed * deltaTime
         )
         this.mesh.scaling.y = this.extension * this.radius
      }
   }

   stopCornering() {
      //this.disableHighlight()
      this.mesh.isVisible = false
   }
}
