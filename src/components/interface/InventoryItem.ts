import { Container, Sprite, Text, Texture } from "pixi.js";
import config from "../../config";
import { game } from "../../index";
import { v4 as uuidv4 } from 'uuid';

interface InventoryItemOptions {
	name: string;
	count?: number;
}

export class InventoryItem {
	count: number;
	name: string;
	pixiObject: Container;
	uuid: string;
	private selected: boolean = false;
	constructor(options: InventoryItemOptions) {
		this.uuid = uuidv4();
		this.name = options.name;
		this.count = options.count || 1;

		this.pixiObject = new Container()

		this.drawSprite()
		this.initClickEvent()
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

		this.initIcon()
		this.initCounter()
	}

	private initCounter() {
		const count = new Text(String(this.count), {
			fontSize: 20,
			align: "center"
		})

		count.x = this.pixiObject.width
		count.y = this.pixiObject.height
		count.anchor.set(.7, .6)

		this.pixiObject.addChild(count)
	}

	private initIcon() {
		const image = this.getImageByName(this.name);
		const texture = Texture.from(`../../../assets/elements/inventory/${image}`);

		const sprite = new Sprite(texture);
		sprite.width = config.inventory.itemSize
		sprite.height = config.inventory.itemSize

		this.pixiObject.addChild(sprite)
	}

	private initClickEvent() {
		this.pixiObject.interactive = true;
		this.pixiObject.on('click', () => game.inventory.selectItem(this))
	}

	unselect() {
		this.pixiObject.alpha = 1
		this.selected = false;
	}

	select() {
		this.selected = true
		this.pixiObject.alpha = 0.5
	}

	remove() {
		this.count = 0;
		this.pixiObject.destroy()
	}
}