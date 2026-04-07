class CameraController {
	constructor(cameraRig, input, config = {}) {
		this.cameraRig = cameraRig;
		this.input = input;

		// Default values if none are provided
		this.currentYaw = config.yaw ?? 0;
		this.currentPitch = config.pitch ?? -0.6;
		this.sensitivity = config.sensitivity ?? 0.002;
		this.minPitch = config.minPitch ?? -1.5;
		this.maxPitch = config.maxPitch ?? 0.3;

		this.autoCenterEnabled = config.autoCenter ?? true;
		this.isCentering = false;
	}

	update(isTargetMoving = false) {
		const isDragging = this.input.mouse.isDown;

		if (isDragging) {
			this.isCentering = false;
			this.currentYaw -= this.input.mouse.moveX * this.sensitivity;
			this.currentPitch -= this.input.mouse.moveY * this.sensitivity;

			this.currentPitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.currentPitch));
		}

		if (this.autoCenterEnabled) {
			if (!isDragging && isTargetMoving) {
				this.isCentering = true;
			}
			if (this.isCentering) this._autoCenter();
		}

		this.cameraRig.setRotation(this.currentYaw, this.currentPitch);
	}

	_autoCenter() {
		const homeYaw = 0;
		const homePitch = -0.4;

		this.currentYaw += (homeYaw - this.currentYaw) * 0.03;
		this.currentPitch += (homePitch - this.currentPitch) * 0.03;

		if (Math.abs(this.currentYaw - homeYaw) < 0.001 &&
			Math.abs(this.currentPitch - homePitch) < 0.001) {
			this.currentYaw = homeYaw;
			this.currentPitch = homePitch;
			this.isCentering = false;
		}
	}
}
export default CameraController;
