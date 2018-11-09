import GameObject from './GameObject'
import Interactable from './Interactable'
import { MeshBuilder, Vector3, Mesh } from 'babylonjs'

export default class InteractablePost extends Interactable {
   height = 10
   directionMultiplier = 0
   wasRotatingLastFrame = false
   cornerStartY = 0
   cornerEndY = 0
   exitAngle = 0
   rotations = 1 / 2

   constructor(
      postIndex: number,
      position: Vector3,
      range: number,
      cornerStartY: number,
      cornerEndY: number,
      directionMultiplier: number
   ) {
      super(range)
      this.directionMultiplier = directionMultiplier
      this.cornerStartY = cornerStartY
      this.cornerEndY = cornerEndY
      this.mesh = MeshBuilder.CreateCylinder(
         `post${postIndex}`,
         { height: 8, diameterTop: 0, diameterBottom: 4 },
         this.scene
      )
      this.mesh.position = position.add(new Vector3(0, this.height / 2, 0))
   }

   start() {}
   update() {}
}
