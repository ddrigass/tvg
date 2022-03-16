import Game from "../Game";

class Menu {
	private element: Element | null;
	constructor(game: Game) {
		this.initMenuKeyboardEvents()
		this.fillButtons()
		this.element = document.querySelector('#menu');
	}

	private initMenuKeyboardEvents() {
		document.addEventListener('keydown', e => {
			if (e.code === 'Escape') {
				this.element?.classList.toggle('hidden')
			}
		})
	}

	private fillButtons() {

	}
}

export default Menu;