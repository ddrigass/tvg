import Game from "./Game";
import Tile from "./mapElements/Tile";
import Tree from "./mapElements/Tree";
import { Container, Sprite, Texture } from "pixi.js";


interface GameMapOptions {
	dragged: boolean;
	background: any;
	foreground: any;
}

class GameMap {
	private game: Game;
	private options: GameMapOptions;
	container: Container;
	constructor(game: Game) {
		this.game = game;
		this.options = {
			background: [],
			foreground: [],
			dragged: false
		};

		this.initDragEvents();
		this.fillMap()

		this.container = new Container();
		this.container.sortableChildren = true;
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
				element.draw();
			}
		}

		for (let row of foreground) {
			for (let m = 0; m < row.length; m++) {
				const element = row[m];
				element.draw();
			}
		}
	}

	private initDragEvents() {
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Space') {
				this.logMap();
			}
		});
		document.addEventListener('mousedown', (e) => {
			this.options.dragged = true;
		});
		document.addEventListener('mouseup', (e) => {
			this.options.dragged = false;
		});
		document.addEventListener('mousemove', (e) => {
			if (this.options.dragged) {
				this.container.x += e.movementX
				this.container.y += e.movementY
			}
		});
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
					type: 'grass',
					position
				})

				const hasTree = !(i % 3) && !( (t + Math.floor(Math.random() * 10)) % 3)

				if (hasTree)
					foregroundRow.push(new Tree({ position }))

				backgroundRow.push(tile)
			}
			this.options.background.push(backgroundRow);
			this.options.foreground.push(foregroundRow);
		}
	}
}

export default GameMap