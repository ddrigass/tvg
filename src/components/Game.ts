import { Application, Container, DisplayObject, settings } from "pixi.js";
import "../style.css";
import GameMap from "./GameMap";
import Player from "./Player";
import Menu from "./menuElements/Menu";
import Inventory from "./interface/Inventory";

declare const VERSION: string;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

export interface Position {
	x: number;
	y: number;
}

class Game {
    app: Application;
    public options: any;
	player: Player;
	public gameMap: GameMap;
	private menu?: Menu;
	inventory: Inventory;
    constructor() {
        this.options = {
            fps: 60,
            map: {
                width: 100,
                height: 100
            }
        };
		settings.SORTABLE_CHILDREN = true;
        this.app = new Application({
            backgroundColor: 0xd3d3d3,
            resizeTo: window,
        });
        document.body.appendChild(this.app.view);

        // @ts-ignore
        window.$GAME = this;

		this.gameMap = new GameMap(this);
		this.player = new Player(this)
		this.menu = new Menu(this);
		this.inventory = new Inventory(this);
    }
    init() {
		this.app.stage.addChild(this.gameMap.container)
		this.app.stage.addChild(this.inventory.container)

		this.gameMap.container.addChild(this.player)

		this.gameMap.draw()
		this.player.draw()
		this.inventory.draw()

		this.app.ticker.add(delta => this.gameLoop(delta));
    }

	private gameLoop(delta: number) {
		this.player?.gameLoop(delta)
	}
}

export default Game;
