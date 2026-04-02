import * as THREE from 'three';

class Player extends THREE.Object3D {
	constructor(startingPlanet) {
		super();

		// Player is composed of a pivot at the center of the planet and the actual model placed
		// at the surface. This facilitates rotation: rotate the pivot and the model follows
		this.playerContent = new THREE.Group();
		this.add(this.playerContent);

		// Build the model
		this.height = 0.05;
		const geometry = new THREE.CapsuleGeometry(this.height, 0.1, 4, 8);
		const material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(geometry, material);

		this.playerContent.add(this.mesh);

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.playerContent.add(this.camera);
		this.isCameraFirstPerson = true;
		this.setFirstPersonCamera();

		this.moveToPlanet(startingPlanet);
	}

	moveToPlanet(planet) {
		if (this.currentPlanet) this.currentPlanet.remove(this);
		this.currentPlanet = planet;

		// The pivot stays at 0,0,0 relative to the planet
		this.position.set(0, 0, 0);
		this.quaternion.set(0, 0, 0, 1);

		// Move the model + camera to the surface
		this.playerContent.position.set(0, planet.radius + this.height, 0);

		planet.add(this);
	}

	moveForward() {
		const speed = 0.015;
		this.rotateX(-speed);
	}

	activateDebugMode() {
		this.playerContent.add(new THREE.AxesHelper(1));
	}

	toggleCamera() {
		if (this.isCameraFirstPerson) {
			this.setThirdPersonCamera();
		}
		else {
			this.setFirstPersonCamera();
		}

		this.isCameraFirstPerson = !this.isCameraFirstPerson;
	}
	setFirstPersonCamera() {
		this.camera.position.set(0, 0, 0);
		this.camera.rotation.set(-0.5, 0, 0);
	}

	setThirdPersonCamera() {
		this.camera.position.set(0, 0.5, 0.6);
		this.camera.rotation.set(-0.9, 0, 0);
	}
}

export default Player;
