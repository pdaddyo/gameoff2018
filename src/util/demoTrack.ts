import { TrackChunkType, TrackChunk } from '../TrackBuilder'

export default [
   {
      type: TrackChunkType.Straight,
      height: 7,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 2,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 4,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 3,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 4,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 2,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 15,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 15,
      rotations: 2 / 3 + 1 / 16,
   },

   {
      type: TrackChunkType.Straight,
      height: 25,
      length: 40,
   },

   {
      type: TrackChunkType.LeftCorner,
      height: 3,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 4,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 4,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 4,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 3,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 5,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 1,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 8,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 2,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 5,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 2,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 12,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 2,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 2,
      rotations: 1 / 3,
   },
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 2,
      rotations: 1 / 3,
   },
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 2,
      rotations: 1 / 4,
   },
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
] as TrackChunk[]
