import * as THREE from 'three';

class Player extends THREE.Object3D {
	constructor(startingPlanet) {
		super();

		// Create mock model to see the player position
		this.height = 0.2;
		const geometry = new THREE.CapsuleGeometry(this.height, 0.5, 4, 8);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		// Create player camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.01,
			10000);
		this.camera.position.set(0, 0.5, 0); // Slightly above player origin, simulating eye height
		this.camera.rotation.x = Math.PI / 2 - 0.4;  // Rotate camera to look forward
		this.add(this.camera);

		// Place Player on starting Planet
		this.moveToPlanet(startingPlanet)

		// Forward movement quaternion
		this.forwardQ = new THREE.Quaternion()
			.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.015);
	}

	moveToPlanet(planet) {
		if (this.currentPlanet) {
			this.currentPlanet.remove(this);
		}

		this.currentPlanet = planet;
		this.position.set(0, planet.radius + this.height / 2, 0);
		this.quaternion.identity(); // reset orientation

		planet.add(this);
	}

	moveForward() {
		this.quaternion.multiply(this.forwardQ);

		const q = this.quaternion;
		const r = this.currentPlanet.radius;

		this.position.x = 2 * (q.y * q.w + q.z * q.x) * r;
		this.position.y = 2 * (q.z * q.y - q.w * q.x) * r;
		this.position.z = ((q.z * q.z + q.w * q.w) - (q.x * q.x + q.y * q.y)) * r;
	}
}

export default Player;

