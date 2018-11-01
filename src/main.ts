import Game from './Game'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
const game = new Game(canvas)
game.start()
