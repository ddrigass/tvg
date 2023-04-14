import { Application, Container, DisplayObject, settings } from "pixi.js";
import "../style.css";
import GameMap from "./GameMap";
import Player from "../entities/Player";
import Menu from "./menuElements/Menu";
import Inventory from "./interface/Inventory";
import { WorldMap } from "./mapElements/WorldMap";

declare const VERSION: string;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

export interface Position {
	x: number;
	y: number;
}

export interface BoxPosition {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

class Game {
    app: Application;
    public options: any;
	player: Player;
	public gameMap: GameMap;
	private menu?: Menu;
	inventory: Inventory;
	worldMap: WorldMap;
    constructor() {
        this.options = {
            fps: 60
        };
		settings.SORTABLE_CHILDREN = true;
        this.app = new Application({
            backgroundColor: 0xd3d3d3,
            resizeTo: window,
        });
        document.body.appendChild(this.app.view);

        // @ts-ignore
        window.$GAME = this;

		this.worldMap = new WorldMap(this);
		this.gameMap = new GameMap(this);
		this.player = new Player(this);
		this.menu = new Menu(this);
		this.inventory = new Inventory(this);
    }
    init() {
		this.app.stage.addChild(
			this.worldMap.container,
			this.gameMap.container,
			this.inventory.container
		)

		this.gameMap.container.addChild(this.player.pixiObject)

		this.player.draw()
		this.inventory.draw()

		this.app.ticker.add(delta => this.gameLoop(delta));
    }

	private async gameLoop(delta: number) {
		await this.player?.gameLoop(delta)
	}
}

export default Game;
