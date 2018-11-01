import GameObject from './GameObject'
import TrackBuilder from './TrackBuilder'
import demoTrack from './util/demoTrack'

export default class Track extends GameObject {
   start() {
      const builder = new TrackBuilder(this.scene)
      this.mesh = builder.createTrack([
         ...demoTrack,
         ...demoTrack,
         ...demoTrack,
         ...demoTrack,
      ])
   }
}
