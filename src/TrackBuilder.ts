import {
   Scene,
   Vector3,
   MeshBuilder,
   TransformNode,
   Space,
   Axis,
   PhysicsImpostor,
} from 'babylonjs'
import Track from './Track'
import InteractablePost from './InteractablePost'

export enum TrackChunkType {
   Straight,
   LeftCorner,
   RightCorner,
}

interface TrackChunkBase {
   type: TrackChunkType
   width?: number
   divisions?: number
   height: number
}

export interface TrackChunkStraight extends TrackChunkBase {
   type: TrackChunkType.Straight
   length: number
}

export interface TrackChunkCorner extends TrackChunkBase {
   type: TrackChunkType.LeftCorner | TrackChunkType.RightCorner
   radius?: number
   rotations?: number
}

export type TrackChunk = TrackChunkStraight | TrackChunkCorner

export default class TrackBuilder {
   private scene: Scene
   defaultCornerRadius = 22
   defaultTrackWidth = 15
   defaultDivisions = 20
   parallelPathCount = 5 // odd number recommended
   cornerOuterBias = 0.45
   bowlHeight = 0
   cursor: TransformNode
   track = new Track()

   constructor(scene: Scene) {
      this.scene = scene
      this.cursor = new TransformNode('trackBuilderCursor')
   }

   createTrack(chunks: TrackChunk[]) {
      const paths = this.createPaths(chunks)
      const trackMesh = MeshBuilder.CreateRibbon('track', {
         pathArray: paths,
      })

      trackMesh.material = this.createMaterial()
      this.track.mesh = trackMesh
      return this.track
   }

   createMaterial() {
      const material = new BABYLON.StandardMaterial('mat1', this.scene)
      material.alpha = 1
      material.diffuseColor = new BABYLON.Color3(0.95, 0.97, 1)
      material.wireframe = false
      material.twoSidedLighting = true
      material.backFaceCulling = false
      return material
   }

   createPaths(chunks: TrackChunk[]) {
      const centerPath = [] as Vector3[]
      const paths = [] as Vector3[][]
      let cornerIndex = 0

      // prepare the path arrays
      for (let pathIndex = 0; pathIndex < this.parallelPathCount; pathIndex++) {
         paths[pathIndex] = []
      }

      for (let trackChunk of chunks) {
         const divisions = trackChunk.divisions || this.defaultDivisions
         const trackWidth = trackChunk.width || this.defaultTrackWidth
         const cornerMultiplier =
            trackChunk.type == TrackChunkType.Straight
               ? 0
               : trackChunk.type === TrackChunkType.LeftCorner
                  ? -1
                  : 1
         const divisionLength =
            trackChunk.type === TrackChunkType.Straight
               ? trackChunk.length / divisions
               : ((trackChunk.radius || this.defaultCornerRadius) / divisions) *
                 1.6

         if (
            trackChunk.type === TrackChunkType.LeftCorner ||
            trackChunk.type === TrackChunkType.RightCorner
         ) {
            const radius = trackChunk.radius || this.defaultCornerRadius
            // place a post
            const postTranslation = new Vector3(
               (cornerMultiplier * radius) / 2,
               -trackChunk.height,
               0
            )
            const cornerStartY = this.cursor.position.y + 0.1
            // translate cursor to post positoin
            this.cursor.locallyTranslate(postTranslation)
            const range = radius / 2 + trackWidth / 2
            this.track.interactables.push(
               new InteractablePost(
                  ++cornerIndex,
                  this.cursor.position,
                  range,
                  cornerStartY,
                  cornerMultiplier
               )
            )
            // translate cursor back again
            this.cursor.locallyTranslate(
               postTranslation.multiplyInPlace(new Vector3(-1, -1, -1))
            )
         }

         for (
            let divisionIndex = 0;
            divisionIndex < divisions;
            divisionIndex++
         ) {
            centerPath.push(this.cursor.position)

            for (
               let pathIndex = 0;
               pathIndex < this.parallelPathCount;
               pathIndex++
            ) {
               // generate the parallel paths
               const translation = new Vector3(
                  (trackWidth / (this.parallelPathCount - 1)) * pathIndex -
                     trackWidth / 2,
                  0,
                  0
               )

               this.cursor.locallyTranslate(translation)
               paths[pathIndex].push(
                  this.cursor.position.add(
                     new Vector3(
                        0,
                        -this.bowlHeight *
                           Math.sin(
                              (pathIndex / (this.parallelPathCount - 1) -
                                 cornerMultiplier * this.cornerOuterBias) *
                                 Math.PI
                           ),
                        0
                     )
                  )
               )

               this.cursor.locallyTranslate(
                  translation.multiplyInPlace(new Vector3(-1, -1, -1))
               )
            }

            this.cursor.position.y -= trackChunk.height / divisions

            if (
               trackChunk.type === TrackChunkType.LeftCorner ||
               trackChunk.type === TrackChunkType.RightCorner
            ) {
               const rotations = trackChunk.rotations || 1 / 2
               this.cursor.rotate(
                  Axis.Y,
                  ((Math.PI * rotations * 2) / divisions) * cornerMultiplier,
                  Space.WORLD
               )

               this.cursor.translate(
                  Vector3.Forward(),
                  divisionLength * (rotations / 0.5),
                  Space.LOCAL
               )
            } else {
               // downhill
               this.cursor.translate(
                  Vector3.Forward(),
                  divisionLength,
                  Space.LOCAL
               )
            }
         }
      }

      this.track.centrePath = centerPath
      return paths
   }
}
