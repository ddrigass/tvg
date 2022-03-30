import { Game } from "@/core/Game";
import { Container, Text } from "pixi.js";

enum WORLD_LOCATIONS {
	FOREST,
	MOUNTAINS,
	SHELTER
}
export class WorldMap {
	private game: Game;
	container: Container;

	constructor(game: Game) {
		this.game = game;
		this.container = new Container();
		this.container.zIndex = 5;

		const forestLocationTitle = new Text('Forest >>')
		forestLocationTitle.interactive = true;
		forestLocationTitle.y = 100;
		forestLocationTitle.on('click', () => {
			this.selectLocation(WORLD_LOCATIONS.FOREST);
		})

		const mountainsLocationTitle = new Text('Mountains >>')
		mountainsLocationTitle.interactive = true;
		mountainsLocationTitle.y = 150;
		mountainsLocationTitle.on('click', () => this.selectLocation(WORLD_LOCATIONS.MOUNTAINS))

		const shelterLocationTitle = new Text('Shelter >>')
		shelterLocationTitle.interactive = true;
		shelterLocationTitle.y = 200;
		shelterLocationTitle.on('click', () => this.selectLocation(WORLD_LOCATIONS.SHELTER))

		this.container.addChild(forestLocationTitle, mountainsLocationTitle, shelterLocationTitle)

		this.hide()
	}

	private selectLocation(location: WORLD_LOCATIONS) {
		console.log(location)
		switch (location) {
			case WORLD_LOCATIONS.FOREST:
				this.hide()
				this.game.gameMap.container.visible = true
				break;
			default:
				break;
		}
	}

	hide() {
		this.container.visible = false;
	}
	show() {
		this.container.visible = true;
	}
}