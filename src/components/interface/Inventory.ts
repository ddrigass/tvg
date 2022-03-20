import { Container, Graphics, ParticleContainer, Sprite, Text } from "pixi.js";
import Game from "../Game";
import { InventoryItem } from "./InventoryItem";
import config from "../../config";
import { InterfaceWindow } from "./InterfaceWindow";
import { Action } from "../../entities/Action";

class Inventory extends InterfaceWindow {
	private items: InventoryItem[];
	private maxItemsCount = 20;
	private buttons: any = {};
	private selectedItem: InventoryItem | null = null;
	constructor(game: Game) {
		super(game, 'Inventory');
		this.items = [];
		this.initEvents()
	}

	draw() {
		super.draw()
		this.drawInventory()
		this.drawButtons();
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
		this.items.forEach((item: InventoryItem, index) => {
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
		this.unselectItem()
	}

	private show() {
		this.draw();
		this.container.visible = true;

		this.game.gameMap.removeDragEvents()
		this.game.player.removeControlsEvent()
	}

	selectItem(item: InventoryItem) {
		this.unselectItem()
		const candidate = this.items.find((el: InventoryItem) => el.uuid === item.uuid)
		if (candidate) {
			candidate.select();
			this.selectedItem = candidate
			this.buttons.removeButton.alpha = 1
		}
	}

	unselectItem() {
		this.selectedItem?.unselect()
		this.selectedItem = null;
		this.buttons.removeButton.alpha = 0.5
	}

	private drawButtons() {
		const buttons = new Container();
		const removeButton = new Text('Remove')
		const divideButton = new Text('Divide')
		const applyButton = new Text('Apply')

		applyButton.x = 0
		divideButton.x = 90
		removeButton.x = 180

		applyButton.interactive = true
		divideButton.interactive = true
		removeButton.interactive = true

		applyButton.on('click', () => {

		})
		divideButton.on('click', () => {

		})
		removeButton.on('click', () => {
			this.items = this.items.filter(el => el.uuid !== this.selectedItem?.uuid)
			this.selectedItem?.remove()
			this.unselectItem()
		})

		applyButton.alpha = 0.5
		divideButton.alpha = 0.5
		removeButton.alpha = 0.5

		this.buttons.applyButton = applyButton
		this.buttons.divideButton = divideButton
		this.buttons.removeButton = removeButton

		buttons.addChild(removeButton, divideButton, applyButton)

		buttons.x = this.container.width - buttons.width - 20
		buttons.y = this.container.height - buttons.height - 20
		this.container.addChild(buttons)
	}
}

export default Inventory;