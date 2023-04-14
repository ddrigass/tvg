import Game, {BoxPosition, Position} from "./Game";
import Tile from "./mapElements/Tile";
import Tree from "./mapElements/objects/Tree";
import {Container, ParticleContainer} from "pixi.js";
import MapElement, {MAP_ELEMENT_TYPE} from "./mapElements/MapElement";
import {Action} from "../entities/Action";
import config from "../config";
import {WORLD_LOCATIONS} from "./mapElements/WorldMap";
import Stone from "./mapElements/objects/Stone";
import House from "./mapElements/objects/House";


interface GameMapOptions {
	dragged: boolean;
}

interface MapSettings {
	name: string;
	sizes: {
		"width": number;
		"height": number;
	}
	background: {
		items: {
			material: string;
			collision: boolean;
		}[][]
	}
	foreground: {
		items: {
			object: string;
			collision: boolean;
		}[][]
	}
}

export const MapObjects = {
	tree: Tree,
	stone: Stone,
	house: House,
} as {
	[name: string]: typeof MapElement;
};

class GameMap {
	private game: Game;
	options: GameMapOptions;
	containers: any;
	container: Container;
	layers: any;
	private mapSettings!: MapSettings;

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
		this.containers = {};

		const maxSize = this.height * this.width * 50;
		this.containers[MAP_ELEMENT_TYPE.NEUTRAL] = new Container();
		this.containers[MAP_ELEMENT_TYPE.BACKGROUND] = new ParticleContainer(maxSize, {});
		this.containers[MAP_ELEMENT_TYPE.FOREGROUND] = new Container();

		this.container = new Container();
		for (let i in this.containers) {
			const container = this.containers[i];
			this.container.addChild(container);
		}

		this.hide();
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
		// console.log(this.layers);
	}

	private setMap(location: WORLD_LOCATIONS) {
		this.mapSettings = require(`../maps/${location}.json`);
	}

	fillMap() {
		const height = this.height;
		const width = this.width;

		for (let layer in MAP_ELEMENT_TYPE) {
			if (!isNaN(Number(layer))) {
				this.layers[layer] = [];
			}
		}

		for (let i = 0; i < height; i++) {
			for (let t = 0; t < width; t++) {

				const elementBackground = this.mapSettings.background.items[i][t];

				const position = {
					x: t,
					y: i,
				};
				const tile = new Tile({
					tileType: elementBackground['material'],
					position,
				});


				const elementForeground = this.mapSettings.foreground.items?.[i]?.[t];

				// const hasTree = !(i % 3) && !((t + Math.floor(Math.random() * 10)) % 3);
				if (elementForeground) {
					const ObjectClass = this.getMapObject(elementForeground['object'])
					if (ObjectClass) {
						this.layers[MAP_ELEMENT_TYPE.FOREGROUND].push(new ObjectClass({
							position,
							collision: elementForeground['collision'] ?? false
						}));
					}
				}


				this.layers[MAP_ELEMENT_TYPE.BACKGROUND].push(tile);
			}
		}
	}

	getMapObject(name: string): typeof MapElement | null{
		return MapObjects[name] ?? null;
	}

	getElementOnPosition(position: Position): MapElement | null {
		return this.layers[MAP_ELEMENT_TYPE.FOREGROUND].find((el: MapElement | null) => {
			return el
				&& position.x >= el.x
				&& position.x <= (el.x + el.width)
				&& position.y >= el.y
				&& position.y <= el.y + el.height
		})
	}

	getElementOnBox(position: BoxPosition): MapElement | null {
		const positions = [
			{
				x: position.x1,
				y: position.y1
			},
			{
				x: position.x1,
				y: position.y2
			},
			{
				x: position.x2,
				y: position.y1
			},
			{
				x: position.x2,
				y: position.y2
			}
		]

		for (let pos of positions) {
			const el = this.getElementOnPosition(pos);
			if (el) return el;
		}
		return null;
	}

	checkCollision(element: MapElement, position: Position) {
		const tileSize = config.game.tileSize;
		const mapWidth = this.width * tileSize;
		const mapHeight = this.height * tileSize;
		if (
			(position.x < 0 || position.y < 0)
			|| (position.x > mapWidth || position.y > mapHeight)
		) {
			return new Action({ type: "exitFromLocation" });
		}

		const el = this.getElementOnBox({
			x1: position.x,
			y1: position.y,
			x2: position.x + element.width,
			y2: position.y + element.height,
		});
		if (el) {
			return el?.collision;
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

	public hide() {
		this.container.visible = false;
	}

	public show() {
		this.container.visible = true;
	}

	setLocation(location: WORLD_LOCATIONS) {
		this.setMap(location);
		this.clearMap();
		this.fillMap();
		this.draw()
	}

	get height() {
		return this.mapSettings?.sizes?.height ?? 40;
	}

	get width() {
		return this.mapSettings?.sizes?.width ?? 40;
	}

	private clearMap() {
		for (let i in this.layers) {
			const layer = this.layers[i]
			for (let element of layer) {
				element?.destroy();
			}
		}
	}
}

export default GameMap