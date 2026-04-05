import * as THREE from 'three';

const _vector = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _right = new THREE.Vector3(1, 0, 0);

// Player is composed of a pivot at the center of the planet and the actual model placed
// at the surface. This facilitates rotation: rotate the pivot and the model follows
class Player extends THREE.Object3D {
	constructor(height, speed) {
		super();

		this.height = height;
		this.speed = speed;
		this.turnSpeed = speed;
		this.radius = height * 0.25;
		this.heading = 0;
		this.isCameraFirstPerson = false;

		this._setupVisuals();
		this._setupCamera();
	}

	_setupVisuals() {
		this.playerModel = new THREE.Group();
		this.add(this.playerModel);

		// Build the model
		const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height);
		const material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
		this.mesh = new THREE.Mesh(geometry, material);

		// Move mesh so feet are at surface level
		this.mesh.position.y = this.height / 2;

		this.playerModel.add(this.mesh);
	}

	_setupCamera() {
		this.cameraPivot = new THREE.Object3D();
		this.playerModel.add(this.cameraPivot);

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.cameraPivot.add(this.camera);

		this.setThirdPersonCamera();
	}

	moveToPlanet(planet) {
		if (this.currentPlanet) this.currentPlanet.remove(this);
		this.currentPlanet = planet;

		// The pivot stays at 0,0,0 relative to the planet
		this.position.set(0, 0, 0);
		this.quaternion.identity();

		// Move the model + camera to the surface
		this.playerModel.position.set(0, planet.radius, 0);

		planet.add(this);
	}

	turn(direction = 1) {
		this.heading += this.turnSpeed * direction;

		this.playerModel.quaternion.setFromAxisAngle(_up, this.heading);
	}

	move(direction = 1) {
		const moveStep = this.speed * direction;

		// Calculate right axis
		_vector.copy(_right).applyAxisAngle(_up, this.heading);

		// Convert to planet right axis
		_vector.applyQuaternion(this.quaternion);

		// Apply rotation to pivot
		_quat.setFromAxisAngle(_vector, -moveStep);
		this.quaternion.premultiply(_quat);
	}

	toggleCamera() {
		this.isCameraFirstPerson = !this.isCameraFirstPerson;

		this.isCameraFirstPerson ? this.setFirstPersonCamera() : this.setThirdPersonCamera();
	}

	setFirstPersonCamera() {
		this.camera.position.set(0, this.height * 0.8, 0);
		this.camera.rotation.set(-0.4, 0, 0);
	}

	setThirdPersonCamera() {
		this.camera.position.set(0, this.height * 3, this.height * 6);
	}

	activateDebugMode() {
		this.playerModel.add(new THREE.AxesHelper(1));
	}
}
export default Player;

