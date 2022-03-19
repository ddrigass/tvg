import Game, { Position } from "./Game";
import Tile from "./mapElements/Tile";
import Tree from "./mapElements/Tree";
import { Container, DisplayObject, ParticleContainer, Sprite, Texture } from "pixi.js";
import { MAP_ELEMENT_TYPE } from "./mapElements/MapElement";
import { Action } from "../Action";
import config from "../config";


interface GameMapOptions {
	dragged: boolean;
	background: any;
	foreground: any;
}

class GameMap {
	private game: Game;
	private options: GameMapOptions;
	containers: any;
	container: Container;

	constructor(game: Game) {
		this.game = game;
		this.options = {
			background: [],
			foreground: [],
			dragged: false,
		};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this.initDragEvents();
		this.fillMap();
		this.containers = {};

		const maxSize = (this.game.options.map.height + this.game.options.map.width) * 50 * 50;
		this.containers[MAP_ELEMENT_TYPE.NEUTRAL] = new Container();
		this.containers[MAP_ELEMENT_TYPE.BACKGROUND] = new ParticleContainer(maxSize, {});
		this.containers[MAP_ELEMENT_TYPE.FOREGROUND] = new Container();

		this.container = new Container();
		for (let i in this.containers) {
			const container = this.containers[i];
			this.container.addChild(container);
		}
	}

	private loadMap() {
		const mapJson = require("../map.json");
		this.options.background = mapJson.background;
		this.options.foreground = mapJson.foreground;
	}

	draw() {
		const background = this.options.background;
		const foreground = this.options.foreground;

		for (let row of background) {
			for (let m = 0; m < row.length; m++) {
				const element = row[m];
				element?.draw();
			}
		}

		for (let row of foreground) {
			for (let m = 0; m < row.length; m++) {
				const element = row[m];
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
				console.log({
					x: this.container.x,
					y: this.container.y,
				});
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
		console.log(JSON.stringify(this.options.background));
	}

	fillMap() {
		const height = this.game.options.map.height;
		const width = this.game.options.map.width;
		for (let i = 0; i < height; i++) {
			const backgroundRow = [];
			const foregroundRow = [];
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
					foregroundRow.push(new Tree({ position }));
				else
					foregroundRow.push(null);


				backgroundRow.push(tile);
			}
			this.options.background.push(backgroundRow);
			this.options.foreground.push(foregroundRow);
		}
	}

	getElementOnPosition(position: Position) {
		return this.containers[MAP_ELEMENT_TYPE.FOREGROUND].children.find((el: Sprite) => {
			return el.x === position.x && el.y === position.y
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

	getNearObject(position: Position): Sprite | null {
		const { children } = this.containers[MAP_ELEMENT_TYPE.FOREGROUND];
		let nearest: DisplayObject | null = null
		let nearestDistance = 0;
		children.forEach((el: Sprite) => {
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