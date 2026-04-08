import * as THREE from 'three';

const CONFIG = {
	SMOOTHING: 0.05
};

export default class CameraRig extends THREE.Object3D {
	constructor() {
		super();
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);

		// Camera hierarchy
		this.yaw = new THREE.Object3D();
		this.pitch = new THREE.Object3D();
		this.add(this.yaw);
		this.yaw.add(this.pitch);
		this.pitch.add(this.camera);
	}

	setRotation(yaw, pitch) {
		// Smooth movement
		this.yaw.rotation.y = THREE.MathUtils.lerp(
			this.yaw.rotation.y,
			yaw,
			CONFIG.SMOOTHING
		);

		this.pitch.rotation.x = THREE.MathUtils.lerp(
			this.pitch.rotation.x,
			pitch,
			CONFIG.SMOOTHING
		);
	}
}

