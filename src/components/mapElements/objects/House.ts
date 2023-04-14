import MapElement, { MAP_ELEMENT_TYPE, MapElementOptions } from "../MapElement";
import { game } from "../../../index";
import { InventoryItem } from "../../interface/InventoryItem";

interface HouseOptions extends MapElementOptions {
}

export default class House extends MapElement {
	constructor(options: HouseOptions) {
		super({
			zIndex: 3,
			size: {
				width: 240,
				height: 200
			},
			position: {
				x: options.position.x,
				y: options.position.y
			},
			image: 'landscape/house.png',
			type: MAP_ELEMENT_TYPE.FOREGROUND
		});
	}

	draw() {
		super.draw();
		this.heightOffset = 50;
		// this.pixiObject.anchor.set(0, 0)
	}

	// doAction() {
	// 	super.doAction();
	//
	// 	const wood = new InventoryItem({
	// 		name: 'wood',
	// 		count: 20,
	// 	})
	// 	const added = game.inventory?.addItem(wood)
	//
	// 	if (added)
	// 		this.destroy()
	// }
}