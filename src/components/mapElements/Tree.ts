import MapElement, { MapElementOptions } from "./MapElement";

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
				y: options.position.y + 0.55
			},
			image: 'landscape/tree.png'
		});
	}
}

export default Tree;