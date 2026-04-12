import * as THREE from 'three';

const _vector = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _right = new THREE.Vector3(1, 0, 0);

const CONFIG = {
	HEIGHT_RATIO: 0.8,
	RADIUS_RATIO: 0.25,
	COLOR: 0x00ff00,
	DEFAULT_HEIGHT: 0.1,
	DEFAULT_SPEED: 0.015
};

// Player is composed of a pivot at the center of the planet and the actual model placed
// at the surface. This facilitates rotation: rotate the pivot and the model follows
export default class Player extends THREE.Object3D {
	constructor({ height = CONFIG.DEFAULT_HEIGHT, speed = CONFIG.DEFAULT_SPEED }) {
		super();

		this.height = height;
		this.speed = speed;
		this.turnSpeed = speed;
		this.radius = height * CONFIG.RADIUS_RATIO;

		this.heading = 0;
		this.isMoving = false;

		this._setupVisuals();
	}

	moveToPlanet(planet) {
		if (this.currentPlanet) this.currentPlanet.removeFromSurface(this);
		this.currentPlanet = planet;

		// The pivot stays at 0,0,0 relative to the planet
		this.position.set(0, 0, 0);
		this.quaternion.identity();

		// Move the model + camera to the surface
		this.playerModel.position.set(0, planet.radius, 0);

		planet.addToSurface(this);
	}

	update() {
		this.isMoving = false;
	}

	turn(direction = 1) {
		this.heading += this.turnSpeed * direction;

		this.playerModel.quaternion.setFromAxisAngle(_up, this.heading);
	}

	move(direction = 1) {
		this.isMoving = true;
		const moveStep = this.speed * direction;

		// Calculate right axis
		_vector.copy(_right).applyAxisAngle(_up, this.heading);

		// Convert to planet right axis
		_vector.applyQuaternion(this.quaternion);

		// Apply rotation to pivot
		_quat.setFromAxisAngle(_vector, -moveStep);
		this.quaternion.premultiply(_quat);
	}

	activateDebugMode() {
		this.playerModel.add(new THREE.AxesHelper(1));
	}

	_setupVisuals() {
		this.playerModel = new THREE.Group();
		this.add(this.playerModel);

		// Build the model
		const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height);
		const material = new THREE.MeshToonMaterial({ color: CONFIG.COLOR });
		this.mesh = new THREE.Mesh(geometry, material);

		// Move mesh so feet are at surface level
		this.mesh.position.y = this.height / 2;

		this.playerModel.add(this.mesh);
	}
}

