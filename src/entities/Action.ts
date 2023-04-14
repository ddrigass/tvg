import { game } from "../index";
import Toastify from 'toastify-js'

interface ActionsOptions {
	type: string;
	text?: string;
}

export class Action {
	private type: string;
	private text: string;
	constructor(options: ActionsOptions) {
		this.type = options.type;
		this.text = options.text || '';
	}
	process() {
		switch (this.type) {
			case 'exitFromLocation':
				game.gameMap.hide()
				game.worldMap.show()
				break;
			case 'text':
				Toastify({
					text: this.text
				}).showToast()
				break;
		}
	}
}