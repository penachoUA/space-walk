import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import Planet from '../entities/Planet.js';
import Star from '../entities/Star.js';
import Player from '../entities/Player.js';
import PlayerController from '../controllers/PlayerController.js'
import CameraRig from '../camera/CameraRig.js';
import InputHandler from './InputHandler.js';

class Game {
	constructor(debug = false) {
		this.input = new InputHandler();

		this._initLighting();
		this._initSystem();
		this._initPlayer();
		this._initCameras();
		this._initControllers();
		this._initResizeHandler();

		this.setCameraMode('system');

		if (debug) this._activateDebugMode();
		renderer.setAnimationLoop(() => this.update());
	}

	update() {
		this.player.isMoving = false;
		this.planets.forEach((p) => p.move());

		if (this.cameraMode === 'thirdPerson' || this.cameraMode === 'firstPerson') {
			this.playerController.update();
		}

		// Handle camera mode changes
		if (this.input.isTapped('KeyV')) {
			this.cycleCameraMode();
		}

		// Handle planet change
		for (let i = 0; i < this.planets.length; i++) {
			if (this.input.isTapped(`Digit${i + 1}`)) {
				this.changePlanet(i);
			}
		}

		// Handle camera movement
		if (this.cameraMode !== 'system') {
			this.cameraRig.update(this.input, this.player.isMoving);
		}

		const activeCamera = (this.cameraMode === 'system') ? this.systemCamera : this.cameraRig.camera;
		renderer.render(scene, activeCamera);

		this.input.afterUpdate();
	}

	setCameraMode(mode) {
		this.cameraMode = mode;

		switch (this.cameraMode) {
			case 'system':
				scene.add(this.cameraRig);
				this.orbitControls.enabled = true;
				break;
			case 'thirdPerson':
				this.player.playerModel.add(this.cameraRig);
				this.cameraRig.position.set(0, this.player.height * 0.8, 0);
				this.cameraRig.camera.position.set(0, this.player.height * 2, this.player.height * 6);
				this.orbitControls.enabled = false;
				break;
			case 'firstPerson':
				this.player.playerModel.add(this.cameraRig);
				this.cameraRig.position.set(0, this.player.height * 0.8, 0);
				this.cameraRig.camera.position.set(0, 0, 0);
				this.orbitControls.enabled = false;
				break;
			case 'planet':
				// TODO: Add more freedom and sensitivity
				this.currentPlanet.add(this.cameraRig);
				this.cameraRig.position.set(0, 0, 0);
				this.cameraRig.camera.position.set(0, 0, this.currentPlanet.radius * 2);
				this.orbitControls.enabled = false;
				break;
		}
	}

	cycleCameraMode() {
		switch (this.cameraMode) {
			case 'system':
				this.setCameraMode('thirdPerson');
				break;
			case 'thirdPerson':
				this.setCameraMode('firstPerson');
				break;
			case 'firstPerson':
				this.setCameraMode('planet');
				break;
			case 'planet':
				this.setCameraMode('system');
				break;
		}

	}

	changePlanet(i) {
		this.currentPlanet = this.planets[i];
		this.player.moveToPlanet(this.currentPlanet);
		this.setCameraMode(this.cameraMode); // Refresh the rig parenting
	}

	_initLighting() {
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
		scene.add(this.ambientLight);
	}

	_initSystem() {
		// Star
		this.star = new Star({
			radius: 4,
			color: 0xebe5c7
		});

		scene.add(this.star);
		// Planets
		this.planets = [
			new Planet({
				radius: 2,
				color: 0x44aaff,
				orbitRadius: 50,
				orbitSpeed: 0.012,
				orbitAngle: 0,
				orbitInclination: 15,
				rotationSpeed: 0.01,
				rotationAxis: 12
			}),
			new Planet({
				radius: 1.5,
				color: 0x2e8c20,
				orbitRadius: 25,
				orbitSpeed: 0.013,
				orbitAngle: 4,
				orbitInclination: 20,
				rotationSpeed: 0.012,
				rotationAxis: 7
			}),
			new Planet({
				radius: 0.5,
				color: 0xa12ad1,
				orbitRadius: 13,
				orbitSpeed: 0.01,
				orbitAngle: 2,
				orbitInclination: -10,
				rotationSpeed: 0.022,
				rotationAxis: 23
			})
		];

		this.planets.forEach((p) => scene.add(p))
		this.currentPlanet = this.planets[1];
	}

	_initPlayer() {
		this.player = new Player(0.1, 0.015);
		this.player.moveToPlanet(this.currentPlanet);
	}

	_initControllers() {
		this.playerController = new PlayerController(this.player, this.input);
	}

	_initCameras() {
		this.systemCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.systemCamera.position.z = 70;

		this.cameraRig = new CameraRig();

		// Orbit Controls
		this.orbitControls = new OrbitControls(this.systemCamera, renderer.domElement);
		this.orbitControls.update();
	}

	_initResizeHandler() {
		window.addEventListener('resize', () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const aspect = width / height;

			renderer.setSize(width, height);

			[this.systemCamera, this.cameraRig.camera].forEach(cam => {
				cam.aspect = aspect;
				cam.updateProjectionMatrix();
			});
		})
	}

	_activateDebugMode() {
		this.planets.forEach((p) => p.activateDebugMode());
		this.player.activateDebugMode();
	}

}
export default Game;

