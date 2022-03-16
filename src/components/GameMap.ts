import Game, { Position } from "./Game";
import Tile from "./mapElements/Tile";
import Tree from "./mapElements/Tree";
import { Container, ParticleContainer, Sprite, Texture } from "pixi.js";
import MapElement, { MAP_ELEMENT_TYPE } from "./mapElements/MapElement";
import { Action } from "../Action";


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
			dragged: false
		};

		this.onMouseDown = this.onMouseDown.bind(this)
		this.onMouseUp = this.onMouseUp.bind(this)
		this.onMouseMove = this.onMouseMove.bind(this)

		this.initDragEvents();
		this.fillMap()
		this.containers = {};

		const maxSize = (this.game.options.map.height + this.game.options.map.width) * 50 * 50;
		this.containers[MAP_ELEMENT_TYPE.NEUTRAL] = new Container();
		this.containers[MAP_ELEMENT_TYPE.BACKGROUND] = new ParticleContainer(maxSize, {});
		this.containers[MAP_ELEMENT_TYPE.FOREGROUND] = new Container();

		this.container = new Container();
		for (let i in this.containers) {
			const container = this.containers[i]
			this.container.addChild(container)
		}
	}

	private loadMap() {
		const mapJson = require('../map.json');
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

		// const fill = new Sprite(Texture.WHITE);
		// fill.x = 0
		// fill.y = 0
		// fill.width = this.container.width
		// fill.height = this.container.height
		// fill.tint = 0x00A300;
		// this.container.addChild(fill)
	}

	initDragEvents() {
		// document.addEventListener('keydown', (e) => {
		// 	if (e.code === 'Space') {
		// 		this.logMap();
		// 	}
		// });
		this.options.dragged = false;
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('mousemove', this.onMouseMove);
	}

	onMouseMove(e:MouseEvent) {
		if (this.options.dragged) {
			this.container.x += e.movementX
			this.container.y += e.movementY
		}
	}

	onMouseUp(e:MouseEvent) {
		this.options.dragged = false;
	}

	onMouseDown(e:MouseEvent) {
		this.options.dragged = true;
	}

	removeDragEvents() {
		document.removeEventListener('mousedown', this.onMouseDown);
		document.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('mousemove', this.onMouseMove);
	}

	private logMap() {
		console.log(JSON.stringify(this.options.background))
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
				}
				const tile = new Tile({
					tileType: 'grass',
					position
				})

				const hasTree = !(i % 3) && !( (t + Math.floor(Math.random() * 10)) % 3)

				if (hasTree)
					foregroundRow.push(new Tree({ position }))
				else
					foregroundRow.push(null)


				backgroundRow.push(tile)
			}
			this.options.background.push(backgroundRow);
			this.options.foreground.push(foregroundRow);
		}
	}

	getElementOnPosition(position: Position) {
		return this.findInMap(this.options.foreground, (el: MapElement) => {
			if (!el) return false;
			return el.position.x === position.x && el.position.y === position.y;
		})
	}

	findInMap(arr:[[]], filter:Function):MapElement | null {
		for (let i = 0; i < arr.length; i++) {
			const subArray = arr[i];
			if (!Array.isArray(subArray)) return null;

			for (let y = 0; y< subArray.length; y++)
				if (filter(subArray[y])) return subArray[y]
		}
		return null
	}

	checkCollision(position: Position) {
		const tileSize = this.game.options.tile.size
		const mapWidth = this.game.options.map.width * tileSize
		const mapHeight = this.game.options.map.height * tileSize
		if (
			(position.x < 0 || position.y < 0)
			|| (position.x > mapWidth || position.y > mapHeight)
		) {
			return new Action({ type: 'exitFromLocation' })
		}
		return true;
	}
}

export default GameMap