class CameraController {
	constructor(target, isAutoCenter = true) {
		this.target = target;
		this._isAutoCenter = isAutoCenter;

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

		this.pitch = Math.max(-1.5, Math.min(0.3, this.pitch));
	}

	update() {
		const pivot = this.target.cameraPivot;

		if (this._isAutoCenter) this._autoCenter();

		// Smooth movement
		pivot.rotation.y += (this.yaw - pivot.rotation.y) * 0.1;
		pivot.rotation.x += (this.pitch - pivot.rotation.x) * 0.1;
	}

	_autoCenter() {
		if (!this.isDragging && this.target.isMoving) {
			const targetYaw = 0;
			const targetPitch = -0.4;

			// Control speed of follow
			this.yaw += (targetYaw - this.yaw) * 0.03;
			this.pitch += (targetPitch - this.pitch) * 0.03;
		}
	}
}
export default CameraController;
