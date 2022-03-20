import Game, { Position } from "./Game";
import Tile from "./mapElements/Tile";
import Tree from "./mapElements/Tree";
import { Container, DisplayObject, ParticleContainer, Sprite, Texture } from "pixi.js";
import MapElement, { MAP_ELEMENT_TYPE } from "./mapElements/MapElement";
import { Action } from "../entities/Action";
import config from "../config";


interface GameMapOptions {
	dragged: boolean;
}

class GameMap {
	private game: Game;
	options: GameMapOptions;
	containers: any;
	container: Container;
	layers: any;

	constructor(game: Game) {
		this.game = game;
		this.options = {
			dragged: false,
		};

		this.layers = {};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this.initDragEvents();
		this.fillMap();
		this.containers = {};

		const maxSize = this.game.options.map.height * this.game.options.map.width * 50;
		this.containers[MAP_ELEMENT_TYPE.NEUTRAL] = new Container();
		this.containers[MAP_ELEMENT_TYPE.BACKGROUND] = new ParticleContainer(maxSize, {});
		this.containers[MAP_ELEMENT_TYPE.FOREGROUND] = new Container();

		this.container = new Container();
		for (let i in this.containers) {
			const container = this.containers[i];
			this.container.addChild(container);
		}
	}

	// private loadMap() {
	// 	const mapJson = require("../map.json");
	// 	this.options.background = mapJson.background;
	// 	this.options.foreground = mapJson.foreground;
	// }

	draw() {
		for (let i in this.layers) {
			const layer = this.layers[i]
			for (let element of layer) {
				element?.draw();
			}
		}
	}

	initDragEvents() {
		document.addEventListener("keydown", (e) => {
			// if (e.code === 'Space') {
			// 	this.logMap();
			// }
			if (e.code === "KeyG") {
				this.logMap();
			}
		});
		this.options.dragged = false;
		document.addEventListener("mousedown", this.onMouseDown);
		document.addEventListener("mouseup", this.onMouseUp);
		document.addEventListener("mousemove", this.onMouseMove);
	}

	onMouseMove(e: MouseEvent) {
		if (this.options.dragged) {
			this.container.x += e.movementX;
			this.container.y += e.movementY;
		}
	}

	onMouseUp(e: MouseEvent) {
		this.options.dragged = false;
	}

	onMouseDown(e: MouseEvent) {
		this.options.dragged = true;
	}

	removeDragEvents() {
		document.removeEventListener("mousedown", this.onMouseDown);
		document.removeEventListener("mouseup", this.onMouseUp);
		document.removeEventListener("mousemove", this.onMouseMove);
	}

	private logMap() {
		// console.log(JSON.stringify(this.options.background));
	}

	fillMap() {
		const height = this.game.options.map.height;
		const width = this.game.options.map.width;

		for (let layer in MAP_ELEMENT_TYPE) {
			if (!isNaN(Number(layer))) {
				this.layers[layer] = [];
			}
		}

		for (let i = 0; i < height; i++) {
			for (let t = 0; t < width; t++) {
				const position = {
					x: t,
					y: i,
				};
				const tile = new Tile({
					tileType: "grass",
					position,
				});

				const hasTree = !(i % 3) && !((t + Math.floor(Math.random() * 10)) % 3);

				if (hasTree)
					this.layers[MAP_ELEMENT_TYPE.FOREGROUND].push(new Tree({ position }));


				this.layers[MAP_ELEMENT_TYPE.BACKGROUND].push(tile);
			}
		}
	}

	getElementOnPosition(position: Position): MapElement | null {
		return this.layers[MAP_ELEMENT_TYPE.FOREGROUND].find((el: MapElement | null) => {
			return el && el.x === position.x && el.y === position.y
		})
	}

	checkCollision(position: Position) {
		const tileSize = config.game.tileSize;
		const mapWidth = this.game.options.map.width * tileSize;
		const mapHeight = this.game.options.map.height * tileSize;
		if (
			(position.x < 0 || position.y < 0)
			|| (position.x > mapWidth || position.y > mapHeight)
		) {
			return new Action({ type: "exitFromLocation" });
		}
		return true;
	}


	async moveTo(position: Position) {
		this.container = Object.assign(this.container, position);
	}

	getNearObject(position: Position): MapElement | null {
		const layer = this.layers[MAP_ELEMENT_TYPE.FOREGROUND];
		let nearest: MapElement | null = null
		let nearestDistance = 0;
		layer.forEach((el: MapElement) => {
			const distanceToEl = this.getDistance({
				x: el.x,
				y: el.y
			}, {
				x: position.x,
				y: position.y
			})
			if (nearestDistance > distanceToEl || nearest === null) {
				nearest = el;
				nearestDistance = distanceToEl;
			}
		})
		if (nearestDistance > config.game.tileSize * 2)
			nearest = null
		return nearest;
	}

	getDistance(posA: Position, posB: Position): number {
		return Math.sqrt( (posB.x - posA.x) ** 2 + (posB.y - posA.y) ** 2);
	}


	async moveOnLeaveFromVisible() {
		if (this.options.dragged) return;

		const playerWidth = this.game.player.width;
		const playerHeight = this.game.player.height;
		const playerXInGame = this.game.player.x
		const playerYInGame = this.game.player.y
		const mapX = -(this.container.x);
		const mapY = -(this.container.y);
		const mapWidth = this.game.app.renderer.width;
		const mapHeight = this.game.app.renderer.height;
		if (playerXInGame - playerWidth < mapX) {
			await this.moveTo({
				x: -(playerXInGame - mapWidth / 2),
				y: -mapY,
			});
		}
		if (playerXInGame + playerWidth > mapX + mapWidth) {
			await this.moveTo({
				x: -(playerXInGame - mapWidth / 2),
				y: -mapY,
			});
		}
		if (playerYInGame - playerHeight < mapY) {
			await this.game.gameMap.moveTo({
				x: -mapX,
				y: -(playerYInGame - mapHeight / 2),
			});
		}
		if (playerYInGame + playerHeight > mapY + mapHeight) {
			await this.game.gameMap.moveTo({
				x: -mapX,
				y: -(playerYInGame - mapHeight / 2),
			});
		}
	}
}

export default GameMap