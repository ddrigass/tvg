import MapElement, { MAP_ELEMENT_TYPE, MapElementOptions } from "./MapElement";
import { game } from "../../index";
import { InventoryItem } from "../interface/InventoryItem";

interface TreeOptions extends MapElementOptions {
}

class Tree extends MapElement {
	constructor(options: TreeOptions) {
		super({
			zIndex: 3,
			size: {
				width: 50,
				height: 75
			},
			position: {
				x: options.position.x,
				y: options.position.y
			},
			image: 'landscape/tree.png',
			type: MAP_ELEMENT_TYPE.FOREGROUND
		});
	}

	draw() {
		super.draw();
		this.anchor.set(0, 0.3)
	}

	doAction() {
		super.doAction();
		this.visible = false;

		const wood = new InventoryItem({
			name: 'wood',
		})
		game.inventory?.addItem(wood)
	}
}

export default Tree;