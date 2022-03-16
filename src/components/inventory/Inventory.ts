import { Container, Graphics, ParticleContainer, Sprite, Text } from "pixi.js";
import Game from "../Game";
import { InventoryItem } from "./InventoryItem";
import config from "../../config";

interface InventoryOptions {
	inventoryWindow: {
		bgColor: number;
	};
}

class Inventory {
	container: Container;
	private game: Game;
	private options: InventoryOptions;
	private items: InventoryItem[];
	constructor(game: Game) {
		this.options = {
			inventoryWindow: {
				bgColor: 0xFFFFFF
			}
		}
		this.game = game;
		this.container = new Container();
		this.container.visible = false
		this.items = [];
		this.initEvents()
	}

	draw() {
		this.container.removeChildren();
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
		this.container.removeChildren()
		const inventoryWindow = new Graphics();

		const { innerWidth, innerHeight } = window

		const width = innerWidth * 0.6,
			height = innerHeight * 0.7,
			x = innerWidth/2 - width/2,
			y = innerHeight/2 - height/2;

		this.container.x = x;
		this.container.y = y;
		this.container.width = width
		this.container.height = height

		inventoryWindow.lineStyle(2, this.options.inventoryWindow.bgColor, 1);
		inventoryWindow.beginFill(this.options.inventoryWindow.bgColor, 0.75);
		inventoryWindow.drawRoundedRect(0, 0, width, height, 15);
		inventoryWindow.endFill();

		this.container.addChild(inventoryWindow);

		const title = new Text('Inventory', {
			fontSize: 30,
			align: "center"
		})

		title.x = width/2
		title.anchor.x = 0.5

		this.container.addChild(title)

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