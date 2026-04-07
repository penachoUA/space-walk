import * as THREE from 'three';

class CameraRig extends THREE.Object3D {
	constructor(autoCenter = true) {
		super();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.autoCenterEnabled = autoCenter;

		// Camera hierarchy
		this.yaw = new THREE.Object3D();
		this.pitch = new THREE.Object3D();
		this.add(this.yaw);
		this.yaw.add(this.pitch);
		this.pitch.add(this.camera);

		this.targetYaw = 0;
		this.targetPitch = -0.6;
		this.sensitivity = 0.001;

		this.isDragging = false;
		this.isCentering = false;
	}

	onMouseDown(e) {
		if (e.button === 0) this.isDragging = true;
	}

	onMouseUp(e) {
		if (e.button === 0) this.isDragging = false;
	}

	onMouseMove(e) {
		if (!this.isDragging) return;

		this.isCentering = false;

		this.targetYaw -= e.movementX * this.sensitivity;
		this.targetPitch -= e.movementY * this.sensitivity;

		this.targetPitch = Math.max(-1.5, Math.min(0.3, this.targetPitch));
	}

	update(isTargetMoving = false) {
		if (this.autoCenterEnabled) {
			if (!this.isDragging && isTargetMoving) {
				this.isCentering = true;
			}
			if (this.isCentering) this._autoCenter();
		}

		// Smooth movement
		this.yaw.rotation.y += (this.targetYaw - this.yaw.rotation.y) * 0.1;
		this.pitch.rotation.x += (this.targetPitch - this.pitch.rotation.x) * 0.1;
	}

	_autoCenter() {
		const homeYaw = 0;
		const homePitch = -0.4;

		// Control speed of follow
		this.targetYaw += (homeYaw - this.targetYaw) * 0.03;
		this.targetPitch += (homePitch - this.targetPitch) * 0.03;

		// Stop centering if centered
		if (Math.abs(this.targetYaw - homeYaw) < 0.001 &&
			Math.abs(this.targetPitch - homePitch) < 0.001) {
			this.targetYaw = homeYaw;
			this.targetPitch = homePitch;
			this.isCentering = false;
		}
	}
}
export default CameraRig;
