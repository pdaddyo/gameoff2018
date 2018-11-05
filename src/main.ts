import Game from './Game'

const pep = require('pepjs')

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
const game = new Game(canvas)
game.start()
