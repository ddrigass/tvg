import { game } from '../../index'
import { Sprite, Texture } from "pixi.js";

export interface ElementPosition {
	x: number;
	y: number;
}
export interface ElementSize {
	width: number;
	height: number;
}
export interface MapElementOptions {
	position: ElementPosition,
	zIndex?: number;
	image?: string;
	size?: ElementSize,
}

const defaultTileSize = 50;

class MapElement {
	private size: ElementSize;
	private position: ElementPosition;
	private image: string;
	private zIndex: number;
	pixiObject?: Sprite;
	constructor(options: MapElementOptions) {
		this.size = options?.size || {
			width: defaultTileSize,
			height: defaultTileSize
		}
		this.position = options.position
		this.image = options.image || 'tiles/stone.png'
		this.zIndex = options.zIndex || 2
	}
	public draw() {
		const elementTexture = Texture.from("../../assets/elements/"+this.image);
		const element = new Sprite(elementTexture)
		element.width = this.size.width;
		element.height = this.size.height;
		element.x = this.position.x * 50;
		element.y = this.position.y * 50;
		element.zIndex = this.zIndex;

		this.pixiObject = element;

		game.gameMap.container.addChild(element)
	}
}

export default MapElement;