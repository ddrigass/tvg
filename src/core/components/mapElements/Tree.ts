import MapElement, { MapElementOptions } from "./MapElement";
import game from "@/core/Game";
import { MAP_ELEMENT_TYPE } from "@common/enums/MAP_ELEMENT_TYPE";

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
		this.pixiObject.anchor.set(0, 0.3)
	}

	doAction() {
		super.doAction();

		console.log('todo: add to inventory')

		// const wood = new InventoryItem({
		// 	name: 'wood',
		// 	count: 20,
		// })
		// const added = game.inventory?.addItem(wood)

		// if (added)
		// 	this.destroy()
	}
}

export default Tree;