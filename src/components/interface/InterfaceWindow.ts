import { Container, Graphics, Text } from "pixi.js";
import Game from "../Game";

interface InterfaceOptions {
	inventoryWindow: {
		bgColor: number;
	};
}

export class InterfaceWindow {
	container: Container;
	protected game: Game;
	protected options: InterfaceOptions;
	private title: string;
	constructor(game: Game, title: string) {
		this.title = title;
		this.options = {
			inventoryWindow: {
				bgColor: 0xFFFFFF
			}
		}
		this.game = game;
		this.container = new Container();
		this.container.visible = false
	}
	draw() {
		this.container.removeChildren();

		this.drawWindow()
		this.drawTitle()
	}

	drawWindow() {
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
	}

	private drawTitle() {
		const title = new Text(this.title, {
			fontSize: 30,
			align: "center"
		})

		title.x = this.container.width/2
		title.anchor.x = 0.5

		this.container.addChild(title)
	}
}