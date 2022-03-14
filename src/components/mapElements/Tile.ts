import MapElement, { MapElementOptions } from "./MapElement";

interface TileOptions extends MapElementOptions {
	type: String;
}

class Tile extends MapElement {
	constructor(options : TileOptions) {
		super({
			...options,
			image: `tiles/${options.type}.png`
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