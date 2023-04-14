import { game } from '../../index'
import { Sprite, Texture } from "pixi.js";
import { Position } from "../Game";
import config from "../../config";

export enum MAP_ELEMENT_TYPE {
	BACKGROUND,
	NEUTRAL,
	FOREGROUND
}

export interface ElementSize {
	width: number;
	height: number;
}
export interface MapElementOptions {
	position: Position,
	type?: MAP_ELEMENT_TYPE;
	zIndex?: number;
	image?: string;
	size?: ElementSize,
	collision?: boolean;
}

class MapElement {
	public pixiObject: Sprite;
	public mapPosition: Position;
	public actionable: boolean = false;
	public collision: boolean = false;

	private size: ElementSize;
	private type: MAP_ELEMENT_TYPE;
	private zIndex: number;
	private image: string;

	protected widthOffset: number = 0;
	protected heightOffset: number = 0;

	defaultTileSize: number;
	constructor(options: MapElementOptions) {
		this.defaultTileSize = config.game.tileSize;
		this.size = options?.size || {
			width: this.defaultTileSize,
			height: this.defaultTileSize
		}
		this.mapPosition = options.position
		this.image = options.image || ''
		this.zIndex = options.zIndex || 2
		this.type = typeof options.type === 'number' ? options.type : MAP_ELEMENT_TYPE.NEUTRAL;

		const texture = this.image ? Texture.from("../../assets/elements/"+this.image) : Texture.WHITE;
		this.pixiObject = new Sprite(texture)
	}
	public draw() {
		this.pixiObject.width = this.size.width;
		this.pixiObject.height = this.size.height;
		this.pixiObject.x = this.mapPosition.x * this.defaultTileSize;
		this.pixiObject.y = this.mapPosition.y * this.defaultTileSize;

		game.gameMap?.containers[this.type].addChild(this.pixiObject)
	}

	getPosition(): Position {
		return {
			x: Math.floor(this.pixiObject.x / this.defaultTileSize),
			y: Math.floor(this.pixiObject.y / this.defaultTileSize),
		}
	}

	setPosition(position: Position) {
		this.pixiObject.x = this.defaultTileSize * position.x
		this.pixiObject.y = this.defaultTileSize * position.y
	}

	doAction() {
		console.log('doAction')
	}

	get x() {
		return this.pixiObject.x + this.widthOffset
	}
	set x(val) {
		this.pixiObject.x = val
	}

	get y() {
		return this.pixiObject.y + this.heightOffset
	}
	set y(val) {
		this.pixiObject.y = val
	}

	get width() {
		return this.pixiObject.width - this.widthOffset - 10
	}
	set width(val) {
		this.pixiObject.width = val
	}

	get height() {
		return this.pixiObject.height - this.heightOffset - 10
	}
	set height(val) {
		this.pixiObject.height = val
	}

	destroy() {
		game.gameMap.containers[this.type].removeChild(this.pixiObject)
		game.gameMap.layers[this.type] = game.gameMap.layers[this.type]
			.filter((el: MapElement) => !(el.x === this.x && el.y === this.y) )
		this.pixiObject.destroy();
	}
}

export default MapElement;