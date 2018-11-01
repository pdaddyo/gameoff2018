import { ParticleSystem, Texture, Vector3, Mesh } from 'babylonjs'
import GameObject from './GameObject'

export default class Snow extends GameObject {
   particleSystem?: ParticleSystem

   start() {
      this.particleSystem = new ParticleSystem(
         'particles',
         500,
         this.scene,
         null,
         true
      )
      this.mesh = Mesh.CreateBox('fountain', 0.1, this.scene)
      this.mesh.position.y = 50
      this.mesh.isVisible = false

      const { particleSystem } = this
      particleSystem.particleTexture = new Texture(
         '/dist/snowflake.png',
         this.scene
      )

      particleSystem.startSpriteCellID = 0
      particleSystem.endSpriteCellID = 1
      particleSystem.spriteCellHeight = 512
      particleSystem.spriteCellWidth = 512
      particleSystem.emitter = this.mesh
      particleSystem.minEmitBox = new Vector3(-100, 0, -100) // Starting all from
      particleSystem.maxEmitBox = new Vector3(100, 0, 100) // To...
      particleSystem.minSize = 0.4
      particleSystem.maxSize = 3
      particleSystem.minLifeTime = 1.2
      particleSystem.maxLifeTime = 1.6
      particleSystem.emitRate = 250
      particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE
      particleSystem.gravity = new Vector3(0, -98, 0)
      particleSystem.direction1 = new Vector3(5.5, -1, 5.5)
      particleSystem.direction2 = new Vector3(-5.5, -1, -5.5)
      particleSystem.minAngularSpeed = 0
      particleSystem.maxAngularSpeed = Math.PI
      particleSystem.minEmitPower = 1
      particleSystem.maxEmitPower = 10
      particleSystem.updateSpeed = 0.005
      particleSystem.startSpriteCellID = Math.round(Math.random() * 3 - 1)
      particleSystem.endSpriteCellID = particleSystem.startSpriteCellID
      // Start the particle system
      particleSystem.preWarmCycles = 200
      particleSystem.start()
   }

   update() {
      // pick a random snowflake
      const randomIndex = Math.round(Math.random() * 3 - 1)
      this.particleSystem!.startSpriteCellID = this.particleSystem!.endSpriteCellID = randomIndex
   }
}
