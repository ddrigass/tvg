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
}

class MapElement extends Sprite {
	private size: ElementSize;
	public mapPosition: Position;
	image: string;
	private type: MAP_ELEMENT_TYPE;
	defaultTileSize: number;
	constructor(options: MapElementOptions) {
		const texture = options.image ? Texture.from("../../assets/elements/"+options.image) : Texture.WHITE;
		super(texture);
		this.defaultTileSize = config.game.tileSize;
		this.size = options?.size || {
			width: this.defaultTileSize,
			height: this.defaultTileSize
		}
		this.mapPosition = options.position
		this.image = options.image || ''
		this.zIndex = options.zIndex || 2
		this.type = typeof options.type === 'number' ? options.type : MAP_ELEMENT_TYPE.NEUTRAL;
	}
	public draw() {
		this.width = this.size.width;
		this.height = this.size.height;
		this.x = this.mapPosition.x * this.defaultTileSize;
		this.y = this.mapPosition.y * this.defaultTileSize;

		game.gameMap?.containers[this.type].addChild(this)
	}

	getPosition(): Position {
		return {
			x: Math.floor(this.x / this.defaultTileSize),
			y: Math.floor(this.y / this.defaultTileSize),
		}
	}

	doAction() {
		console.log('doAction')
	}
}

export default MapElement;