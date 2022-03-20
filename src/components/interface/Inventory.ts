import { Container, Graphics, ParticleContainer, Sprite, Text } from "pixi.js";
import Game from "../Game";
import { InventoryItem } from "./InventoryItem";
import config from "../../config";
import { InterfaceWindow } from "./InterfaceWindow";
import { Action } from "../../entities/Action";

class Inventory extends InterfaceWindow {
	private items: InventoryItem[];
	private maxItemsCount = 20;
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
				if (this.container.visible) {
					this.hide();
				} else {
					this.show();
				}
			}
		})
	}


	private drawInventory() {
		const inventoryItems = new Container()
		inventoryItems.y = 50
		this.items.forEach((item, index) => {
			const countInRow = Math.floor(this.container.width / config.inventory.itemSize);
			item.pixiObject.x = (index % countInRow) * config.inventory.itemSize
			item.pixiObject.y = Math.floor(index / countInRow) * config.inventory.itemSize
			inventoryItems.addChild(item.pixiObject)
		})
		this.container.addChild(inventoryItems)
	}

	addItem(item: InventoryItem): Boolean {
		const addedToExist = this.items.find(el => {
			return el.name === item.name && el.count < 20;
		})?.addCount(item.count);
		if (this.items.length > this.maxItemsCount) {
			new Action({
				type: "text",
				text: "Inventory full!",
			}).process();
			return false;
		}
		if (!addedToExist)
			this.items.push(item)
		return true;
	}

	private hide() {
		this.container.visible = false;
		this.game.gameMap?.initDragEvents()
		this.game.player?.initControlsEvents()
	}

	private show() {
		this.draw();
		this.container.visible = true;

		this.game.gameMap.removeDragEvents()
		this.game.player.removeControlsEvent()
	}
}

export default Inventory;