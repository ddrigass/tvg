import Game, { Position } from "./Game";
import MapElement, { MAP_ELEMENT_TYPE } from "./mapElements/MapElement";
import { Action } from "../Action";
import config from "../config";
import { Sprite } from "pixi.js";


interface PlayerMovement {
	horizontal: number;
	vertical: number;
}

class Player extends MapElement {
	private game: Game;
	private movement: PlayerMovement;
	private lastMovement: number;
	private nearestObject: Sprite | null;
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
		this.nearestObject = null
		this.game = game;

		this.onKeyDown = this.onKeyDown.bind(this)
		this.onKeyUp = this.onKeyUp.bind(this)
		this.initControlsEvents();
	}

	gameLoop(delta:number) {
		const step = config.game.tileSize;
		// const step = delta * 2;
		const timestamp = +new Date();
		if (timestamp < this.lastMovement + 5) return
		if (this.movement.horizontal !== 0) {
			this.goTo({
				x: this.x + this.movement.horizontal * 3 * delta,
				y: this.y
			})
			this.lastMovement = timestamp;
		}
		if (this.movement.vertical !== 0) {
			this.goTo({
				x: this.x,
				y: this.y + this.movement.vertical * 3 * delta
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
		if (!this.nearestObject) return false;
		const position = {
			x: this.nearestObject.x,
			y: this.nearestObject.y
		};
		const element = this.game.gameMap?.getElementOnPosition(position)
		if (!element) return false;
		element.doAction();
		this.nearestObject = null;
	}

	private async goTo(position: Position) {
		const collision = this.game.gameMap?.checkCollision(position)
		if (collision instanceof Action) {
			collision.process()
		}
		if (collision === true) {
			this.x = position.x
			this.y = position.y
			this.highlightNearObject()
		}

		await this.game.gameMap.moveOnLeaveFromVisible()
	}

	private highlightNearObject() {
		if (this.nearestObject)
			this.nearestObject.alpha = 1
		this.nearestObject = this.game.gameMap.getNearObject({
			x: this.x,
			y: this.y
		});
		if (this.nearestObject)
			this.nearestObject.alpha = 0.5
	}
}

export default Player;