const DEFAULTS = {
	YAW: 0,
	PITCH: -0.6,
	SENSITIVITY: 0.002,
	MIN_PITCH: -1.5,
	MAX_PITCH: 0.3,
	AUTO_CENTER: true,
	CENTERING_SPEED: 0.03,
	CENTERING_THRESHOLD: 0.001,
};

export default class CameraController {
	constructor({ cameraRig, input, config = {} }) {
		this.cameraRig = cameraRig;
		this.input = input;

		// Default values if none are provided
		this.currentYaw = config.yaw ?? DEFAULTS.YAW;
		this.currentPitch = config.pitch ?? DEFAULTS.PITCH;
		this.sensitivity = config.sensitivity ?? DEFAULTS.SENSITIVITY;
		this.minPitch = config.minPitch ?? DEFAULTS.MIN_PITCH;
		this.maxPitch = config.maxPitch ?? DEFAULTS.MAX_PITCH;

		this.autoCenterEnabled = config.autoCenter ?? DEFAULTS.AUTO_CENTER;
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
		this.currentYaw += (DEFAULTS.YAW - this.currentYaw) * DEFAULTS.CENTERING_SPEED;
		this.currentPitch += (DEFAULTS.PITCH - this.currentPitch) * DEFAULTS.CENTERING_SPEED;

		if (Math.abs(this.currentYaw - DEFAULTS.YAW) < DEFAULTS.CENTERING_THRESHOLD &&
			Math.abs(this.currentPitch - DEFAULTS.PITCH) < DEFAULTS.CENTERING_THRESHOLD) {
			this.currentYaw = DEFAULTS.YAW;
			this.currentPitch = DEFAULTS.PITCH;
			this.isCentering = false;
		}
	}
}

