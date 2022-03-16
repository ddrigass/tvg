import { game } from '../../index'
import { Sprite, Texture } from "pixi.js";
import { Position } from "../Game";

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
}

class MapElement {
	private size: ElementSize;
	public position: Position;
	private image: string;
	private zIndex: number;
	pixiObject?: Sprite;
	private type: MAP_ELEMENT_TYPE;
	private defaultTileSize: number;
	constructor(options: MapElementOptions) {
		this.defaultTileSize = game.options.tile.size;
		this.size = options?.size || {
			width: this.defaultTileSize,
			height: this.defaultTileSize
		}
		this.position = options.position
		this.image = options.image || ''
		this.zIndex = options.zIndex || 2
		this.type = typeof options.type === 'number' ? options.type : MAP_ELEMENT_TYPE.NEUTRAL;
	}
	public draw() {
		let elementTexture;
		if (this.image) {
			elementTexture = Texture.from("../../assets/elements/"+this.image);
		} else {
			elementTexture = Texture.WHITE;
		}
		const element = new Sprite(elementTexture)
		element.width = this.size.width;
		element.height = this.size.height;
		element.x = this.position.x * this.defaultTileSize;
		element.y = this.position.y * this.defaultTileSize;
		element.zIndex = this.zIndex;

		this.pixiObject = element;

		game.gameMap?.containers[this.type].addChild(element)
	}

	getPosition(): Position {
		if (!this.pixiObject) throw new Error('pixiObject not initialized.')
		return {
			x: this.pixiObject?.x / this.defaultTileSize,
			y: this.pixiObject?.y / this.defaultTileSize,
		}
	}

	doAction() {
		console.log('doAction')
	}
}

export default MapElement;