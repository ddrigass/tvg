import game from "@/core/Game";

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
				game.gameMap.container.visible = false;
				game.worldMap.show()
				break;
			case 'text':
				// Toastify({
				// 	text: this.text
				// }).showToast()
				console.log('Тут должен быть тост', this.text)
				break;
		}
	}
}