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
				// game.gameMap.container.visible = false;
		}
	}
}