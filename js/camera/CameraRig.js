import * as THREE from 'three';

class CameraRig extends THREE.Object3D {
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
		this.yaw.rotation.y += (yaw - this.yaw.rotation.y) * 0.1;
		this.pitch.rotation.x += (pitch - this.pitch.rotation.x) * 0.1;
	}
}
export default CameraRig;
