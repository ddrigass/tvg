import { game } from "./index";

interface ActionsOptions {
	type: string;
}

export class Action {
	private type: string;
	constructor(options: ActionsOptions) {
		this.type = options.type;
	}
	process() {
		switch (this.type) {
			case 'exitFromLocation':
				// if (game.gameMap)
				// 	game.gameMap.container.visible = false;
		}
	}
}