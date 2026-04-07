class InputHandler {
	constructor() {
		this.keys = {};
		this.previousKeys = {};
		this.mouse = {
			isDown: false,
			x: 0,
			y: 0,
			moveX: 0,
			moveY: 0
		};

		this._initKeyboardInput();
		this._initMouseInput();
	}

	// Set state for next frame
	afterUpdate() {
		this.previousKeys = { ...this.keys };

		// Clear mouse deltas
		this.mouse.moveX = 0;
		this.mouse.moveY = 0;
	}

	isPressed(code) {
		return !!this.keys[code];
	}

	isTapped(code) {
		return !!this.keys[code] && !this.previousKeys[code];
	}

	_initKeyboardInput() {
		window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
		window.addEventListener('keyup', (e) => this.keys[e.code] = false);

	}

	_initMouseInput() {
		window.addEventListener('pointerdown', (e) => {
			if (e.button === 0) this.mouse.isDown = true;
		});

		window.addEventListener('pointerup', (e) => {
			if (e.button === 0) this.mouse.isDown = false;
		});

		window.addEventListener('pointermove', (e) => {
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;

			// Update deltas
			this.mouse.moveX = e.movementX;
			this.mouse.moveY = e.movementY;
		});

		// Stop dragging if the mouse leaves the window
		window.addEventListener('mouseleave', () => {
			this.mouse.isDown = false;
		});
	}
}
export default InputHandler;
