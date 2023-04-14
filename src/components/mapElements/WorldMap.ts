import Game from "../Game";
import { Container, Text } from "pixi.js";

export enum WORLD_LOCATIONS {
	FOREST = 'forest',
	MOUNTAINS = 'mountains',
	SHELTER = 'shelter'
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
	}

	private selectLocation(location: WORLD_LOCATIONS) {
		this.hide()
		this.game.gameMap.setLocation(location)
		this.game.gameMap.show()
		this.game.player.setPosition({ x: 1, y:1 })
	}

	hide() {
		this.container.visible = false;
	}
	show() {
		this.container.visible = true;
	}
}