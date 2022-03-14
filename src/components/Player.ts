import Game from "./Game";
import MapElement from "./mapElements/MapElement";


interface PlayerMovement {
	horizontal: number;
	vertical: number;
}

class Player extends MapElement {
	private game: Game;
	private movement: PlayerMovement;
	private lastMovement: number;
	constructor(game: Game) {
		super({
			image: 'players/player.png',
			position: {
				x: 0,
				y: 0
			},
			zIndex: 2,
		});
		this.movement = {
			horizontal: 0,
			vertical: 0
		}
		this.lastMovement = 0;
		this.game = game;
		this.initControlsEvents();
	}

	gameLoop(delta:number) {
		if (!this.pixiObject) return;
		const step = this.game.options.tile.size;
		// const step = delta * 2;
		const timestamp = +new Date();
		if (timestamp < this.lastMovement + 300) return
		if (this.movement.horizontal !== 0) {
			this.pixiObject.x += this.movement.horizontal * step
			this.lastMovement = timestamp;
		}
		if (this.movement.vertical !== 0) {
			this.pixiObject.y += this.movement.vertical * step
			this.lastMovement = timestamp;
		}
	}

	initControlsEvents() {
		document.addEventListener('keydown', e => {
			if (e.code === 'KeyW') {
				this.movement.vertical = -1
			}
			if (e.code === 'KeyS') {
				this.movement.vertical = 1
			}
			if (e.code === 'KeyA') {
				this.movement.horizontal = -1
			}
			if (e.code === 'KeyD') {
				this.movement.horizontal = 1
			}
		})
		document.addEventListener('keyup', e => {
			if (e.code === 'KeyW') {
				this.movement.vertical = 0
			}
			if (e.code === 'KeyS') {
				this.movement.vertical = 0
			}
			if (e.code === 'KeyA') {
				this.movement.horizontal = 0
			}
			if (e.code === 'KeyD') {
				this.movement.horizontal = 0
			}
		})
	}
}

export default Player;