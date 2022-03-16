import Game, { Position } from "./Game";
import MapElement, { MAP_ELEMENT_TYPE } from "./mapElements/MapElement";
import { Action } from "../Action";


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
			type: MAP_ELEMENT_TYPE.NEUTRAL
		});
		this.movement = {
			horizontal: 0,
			vertical: 0
		}
		this.lastMovement = 0;
		this.game = game;

		this.onKeyDown = this.onKeyDown.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
		this.initControlsEvents();
	}

	gameLoop(delta:number) {
		if (!this.pixiObject) return;
		const step = this.game.options.tile.size;
		// const step = delta * 2;
		const timestamp = +new Date();
		if (timestamp < this.lastMovement + 300) return
		if (this.movement.horizontal !== 0) {
			this.goTo({
				x: this.pixiObject.x + this.movement.horizontal * step,
				y: this.pixiObject.y
			})
			this.lastMovement = timestamp;
		}
		if (this.movement.vertical !== 0) {
			this.goTo({
				x: this.pixiObject.x,
				y: this.pixiObject.y += this.movement.vertical * step
			})
			this.lastMovement = timestamp;
		}
	}

	removeControlsEvent() {
		document.removeEventListener('keydown', this.onKeyDown)
	}

	initControlsEvents() {
		document.addEventListener('keydown', this.onKeyDown)
		document.addEventListener('keyup', this.onKeyUp )
	}

	onKeyDown(e: KeyboardEvent)  {
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
		if (e.code === 'Space') {
			this.doAction();
		}
	}

	onKeyUp(e: KeyboardEvent) {
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
	}

	doAction() {
		const position = this.getPosition();
		const element = this.game.gameMap?.getElementOnPosition(position)
		if (!element) return false;
		element.doAction();
	}

	private goTo(position: Position) {
		if (!this.pixiObject) return;
		const collision = this.game.gameMap?.checkCollision(position)
		if (collision instanceof Action) {
			collision.process()
		}
		if (collision === true) {
			this.pixiObject = Object.assign(this.pixiObject, position)
		}
	}
}

export default Player;