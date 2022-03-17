import { Container } from "pixi.js";
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
	constructor(game: Game) {
		this.options = {
			inventoryWindow: {
				bgColor: 0xFFFFFF
			}
		}
		this.game = game;
		this.container = new Container();
		this.container.visible = false
	}
}