import { TrackChunkType, TrackChunk } from '../TrackBuilder'

export default [
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 10,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 10,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 12,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 15,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 12,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 18,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 12,
      rotations: 2 / 3 + 1 / 16,
   },

   {
      type: TrackChunkType.Straight,
      height: 25,
      length: 40,
   },

   {
      type: TrackChunkType.LeftCorner,
      height: 12,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 14,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 8,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 14,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 8,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 25,
      length: 40,
   },
   {
      type: TrackChunkType.RightCorner,
      height: 8,
      rotations: 1 / 2 - 1 / 16,
   },
   {
      type: TrackChunkType.Straight,
      height: 18,
      length: 40,
   },
   {
      type: TrackChunkType.LeftCorner,
      height: 10,
      rotations: 1 / 2,
   },
   {
      type: TrackChunkType.Straight,
      height: 25,
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
