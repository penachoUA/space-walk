export default class PlayerController {
	constructor({ player, input }) {
		this.player = player;
		this.input = input;
	}

	update() {
		if (this.input.isPressed('KeyW') || this.input.isPressed('ArrowUp')) this.player.move(1);
		if (this.input.isPressed('KeyS') || this.input.isPressed('ArrowDown')) this.player.move(-1);
		if (this.input.isPressed('KeyA') || this.input.isPressed('ArrowLeft')) this.player.turn(1);
		if (this.input.isPressed('KeyD') || this.input.isPressed('ArrowRight')) this.player.turn(-1);
	}
}

