import * as THREE from 'three';

class CameraController {
	constructor(player) {
		this.player = player;

		this.yaw = 0;
		this.pitch = -0.6;
		this.sensitivity = 0.001;

		this.isDragging = false;
	}

	onMouseDown(e) {
		if (e.button === 0) this.isDragging = true;
	}

	onMouseUp(e) {
		if (e.button === 0) this.isDragging = false;
	}

	onMouseMove(e) {
		if (!this.isDragging) return;

		this.yaw -= e.movementX * this.sensitivity;
		this.pitch -= e.movementY * this.sensitivity;

		this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch));
	}

	update() {
		const pivot = this.player.cameraPivot;

		pivot.rotation.y += (this.yaw - pivot.rotation.y) * 0.1;
		pivot.rotation.x += (this.pitch - pivot.rotation.x) * 0.1;
	}
}
export default CameraController;
