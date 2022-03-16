import MapElement, { MAP_ELEMENT_TYPE, MapElementOptions } from "./MapElement";

interface TileOptions extends MapElementOptions {
	tileType: String;
}

class Tile extends MapElement {
	constructor(options : TileOptions) {
		super({
			...options,
			image: `tiles/${options.tileType}.png`,
			type: MAP_ELEMENT_TYPE.BACKGROUND
		});
	}
	// draw() {
	// 	super.draw();
	//
	// 	if (!this.pixiObject) return;
	//
	// 	this.pixiObject.interactive = true;
	//
	// 	this.pixiObject.on('mouseover', function (mouseData) {
	// 		mouseData.currentTarget.alpha = 0.5;
	// 	})
	//
	// 	this.pixiObject.on('mouseout', function (mouseData) {
	// 		mouseData.currentTarget.alpha = 1;
	// 	})
	// }
}

export default Tile;