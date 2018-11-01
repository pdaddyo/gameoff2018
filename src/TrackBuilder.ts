import {
   Scene,
   Vector3,
   MeshBuilder,
   TransformNode,
   Space,
   Axis,
   PhysicsImpostor,
} from 'babylonjs'

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
   defaultTrackWidth = 10
   defaultDivisions = 12
   parallelPathCount = 5 // odd number recommended
   cornerOuterBias = 0.25
   bowlHeight = 0
   cursor: TransformNode

   constructor(scene: Scene) {
      this.scene = scene
      this.cursor = new TransformNode('trackBuilderCursor')
   }

   createTrack(chunks: TrackChunk[]) {
      const paths = this.createPaths(chunks)
      const track = MeshBuilder.CreateRibbon('track', {
         pathArray: paths,
      })

      const material = new BABYLON.StandardMaterial('mat1', this.scene)
      material.alpha = 1.0
      material.diffuseColor = new BABYLON.Color3(0.95, 0.97, 1)
      material.wireframe = false
      material.twoSidedLighting = true
      material.backFaceCulling = false
      track.material = material

      return track
   }

   createPaths(chunks: TrackChunk[]) {
      const centerPath = [] as Vector3[]
      const paths = [] as Vector3[][]

      // prepare the path arrays
      for (let pathIndex = 0; pathIndex < this.parallelPathCount; pathIndex++) {
         paths[pathIndex] = []
      }

      for (let trackChunk of chunks) {
         const divisions = trackChunk.divisions || this.defaultDivisions
         const trackWidth = trackChunk.width || this.defaultTrackWidth
         const divisionLength =
            trackChunk.type === TrackChunkType.Straight
               ? trackChunk.length / divisions
               : (trackChunk.radius || this.defaultCornerRadius) / divisions

         for (
            let divisionIndex = 0;
            divisionIndex < divisions;
            divisionIndex++
         ) {
            centerPath.push(this.cursor.position)
            const cornerMultiplier =
               trackChunk.type == TrackChunkType.Straight
                  ? 0
                  : trackChunk.type === TrackChunkType.LeftCorner
                     ? -1
                     : 1
            for (
               let pathIndex = 0;
               pathIndex < this.parallelPathCount;
               pathIndex++
            ) {
               // generate the parallel paths
               const translation = new Vector3(
                  (trackWidth / this.parallelPathCount) * pathIndex -
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

            this.cursor.translate(
               Vector3.Forward(),
               divisionLength,
               Space.LOCAL
            )
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
            }
         }
      }
      //   const lines = MeshBuilder.CreateLines('trackCenterLine', {
      //      points: centerPath,
      //   })
      return paths
   }
}
