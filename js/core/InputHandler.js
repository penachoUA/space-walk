class InputHandler {
	constructor() {
		this.keys = {};
		this.mouse = {
			isDown: false,
			x: 0,
			y: 0,
			movementX: 0,
			movementY: 0
		};

		this._initKeyboardInput();
		this._initMouseInput();
	}

	isPressed(code) {
		return !!this.keys[code];
	}

	_initKeyboardInput() {
		window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
		window.addEventListener('keyup', (e) => this.keys[e.code] = false);

	}

	_initMouseInput() {
		window.addEventListener('pointerdown', (e) => {
			// e.button === 0 is the Left Mouse Button
			if (e.button === 0) this.mouse.isDown = true;
		});

		window.addEventListener('pointerup', (e) => {
			if (e.button === 0) this.mouse.isDown = false;
		});

		window.addEventListener('pointermove', (e) => {
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;

			// Deltas since last frame
			this.mouse.movementX = e.movementX;
			this.mouse.movementY = e.movementY;
		});

		// If the mouse leaves the window, stop dragging
		window.addEventListener('mouseleave', () => {
			this.mouse.isDown = false;
		});
	}
}
export default InputHandler;
