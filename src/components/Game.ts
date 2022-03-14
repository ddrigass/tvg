import { Application, Sprite, Texture, Container } from "pixi.js";
import "../style.css";
import GameMap from "./GameMap";
import Player from "./Player";
import Menu from "./Menu";

declare const VERSION: string;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

interface GameOption {
    width: number;
    height: number;
}

class Game {
    app: Application;
    public options: any;
    private drag: any;
	private player: Player;
	public gameMap: GameMap;
	private menu: Menu;
    constructor() {
        this.options = {
            fps: 60,
            map: {
                width: 40,
                height: 40
            },
            tile: {
                size: 50
            }
        };
        this.app = new Application({
            backgroundColor: 0xd3d3d3,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        this.gameMap = new GameMap(this);
		this.player = new Player(this)
		this.menu = new Menu(this);

		this.app.stage.addChild(this.gameMap.container)

		if (this.player.pixiObject)
			this.gameMap.container.addChild(this.player.pixiObject)


        // @ts-ignore
        window.$GAME = this;
    }
    init() {
		this.gameMap.draw()
		this.player.draw()

		this.app.ticker.add(delta => this.gameLoop(delta));
    }

	private gameLoop(delta: number) {
		this.player.gameLoop(delta)
	}
}

export default Game;
