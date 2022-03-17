import { Container, Sprite, Text, Texture } from "pixi.js";
import config from "../../config";

interface InventoryItemOptions {
	name: string;
	count?: number;
}

export class InventoryItem {
	count: number;
	name: string;
	pixiObject: Container;
	constructor(options: InventoryItemOptions) {
		this.name = options.name;
		this.count = options.count || 1;

		this.pixiObject = new Container()

		this.drawSprite()
	}

	private getImageByName(name: string) {
		return config.inventory.items.find(el => el.name === name)?.image
	}

	addCount(count: number) {
		if (this.count + count > 20) return null;
		this.count += count
		this.drawSprite();
		return this.count;
	}

	private drawSprite() {
		this.pixiObject.removeChildren();

		const image = this.getImageByName(this.name);
		const texture = Texture.from(`../../../assets/elements/inventory/${image}`);

		const sprite = new Sprite(texture);
		sprite.width = config.inventory.itemSize
		sprite.height = config.inventory.itemSize
		this.pixiObject.addChild(sprite)

		const count = new Text(String(this.count), {
			fontSize: 20,
			align: "center"
		})

		count.x = sprite.width
		count.y = sprite.height
		count.anchor.set(.7, .6)

		this.pixiObject.addChild(count)
	}
}