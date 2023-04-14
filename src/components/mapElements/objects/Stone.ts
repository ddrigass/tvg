import MapElement, { MAP_ELEMENT_TYPE, MapElementOptions } from "../MapElement";
import { game } from "../../../index";
import { InventoryItem } from "../../interface/InventoryItem";

interface StoneOptions extends MapElementOptions {
}

export default class Stone extends MapElement {
	constructor(options: StoneOptions) {
		super({
			zIndex: 3,
			size: {
				width: 50,
				height: 50
			},
			position: {
				x: options.position.x,
				y: options.position.y
			},
			image: 'landscape/stone.png',
			type: MAP_ELEMENT_TYPE.FOREGROUND
		});
	}

	draw() {
		super.draw();
		// this.pixiObject.anchor.set(0, 0.3)
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