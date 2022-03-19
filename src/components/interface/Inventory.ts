import { Container, Graphics, ParticleContainer, Sprite, Text } from "pixi.js";
import Game from "../Game";
import { InventoryItem } from "./InventoryItem";
import config from "../../config";
import { InterfaceWindow } from "./InterfaceWindow";

class Inventory extends InterfaceWindow {
	private items: InventoryItem[];
	constructor(game: Game) {
		super(game, 'Inventory');
		this.items = [];
		this.initEvents()
	}

	draw() {
		super.draw()
		this.drawInventory()
	}

	private initEvents() {
		document.addEventListener('keydown', e => {
			if (e.code === 'KeyI') {
				this.container.visible = !this.container.visible
				if (this.container.visible) {
					this.game.gameMap?.removeDragEvents()
					this.game.player?.removeControlsEvent()
				} else {
					this.game.gameMap?.initDragEvents()
					this.game.player?.initControlsEvents()
				}
			}
		})
		window.addEventListener('resize', e => {
			this.draw()
		})
	}

	private drawInventory() {
		const inventoryItems = new Container()
		inventoryItems.y = 50
		this.items.forEach((item, index) => {
			const countInRow = Math.round(this.container.width / config.inventory.itemSize);
			item.pixiObject.x = (index % countInRow) * config.inventory.itemSize
			item.pixiObject.y = Math.round(index / countInRow) * config.inventory.itemSize
			inventoryItems.addChild(item.pixiObject)
		})
		this.container.addChild(inventoryItems)
	}

	addItem(item: InventoryItem) {
		const addedToExist = this.items.find(el => {
			return el.name === item.name && el.count < 20;
		})?.addCount(item.count);
		if (!addedToExist)
			this.items.push(item)

		this.draw();
	}
}

export default Inventory;