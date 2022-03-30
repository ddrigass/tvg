import { Application, settings } from "pixi.js";
import GameMap from "./components/GameMap";
import Player from "./entities/Player";
import { WorldMap } from "./components/mapElements/WorldMap";

export interface Position {
	x: number;
	y: number;
}

export class Game {
    app: Application;
	private selector: string;

    public options: any;
	public gameMap: GameMap;
	public player: Player;
	public worldMap: WorldMap;

	constructor(selector: string) {
        this.options = {
            fps: 60,
            map: {
                width: 100,
                height: 100
            }
        };
		this.selector = selector;
		settings.SORTABLE_CHILDREN = true;
        this.app = new Application({
            backgroundColor: 0xd3d3d3,
            resizeTo: window,
        });

        // @ts-ignore
        window.$GAME = this;

		this.worldMap = new WorldMap(this);
		this.gameMap = new GameMap(this);
		this.player = new Player(this);
    }

	append() {
		document.querySelector(this.selector)!.appendChild(this.app.view);
	}

    init() {
		this.app.stage.addChild(
			this.worldMap.container,
			this.gameMap.container,
		)

		this.gameMap.container.addChild(this.player.pixiObject)

		this.gameMap.draw()
		this.player.draw()

		this.app.ticker.add((delta:number) => this.gameLoop(delta));
    }

	private gameLoop(delta: number) {
		this.player?.gameLoop(delta)
	}
}

const game = new Game('#game');
export default game;
