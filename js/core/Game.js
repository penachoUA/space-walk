import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Planet from '../entities/Planet.js';
import Star from '../entities/Star.js';
import Player from '../entities/Player.js';
import PlayerController from '../controllers/PlayerController.js'
import CameraController from '../controllers/CameraController.js';
import CameraRig from '../camera/CameraRig.js';
import InputHandler from './InputHandler.js';

const CONTROLS = {
	CYCLE_CAMERA: 'KeyV',
	PLANET_PREFIX: 'Digit',
};

const CAMERA_MODES = {
	SYSTEM: 'system',
	THIRD_PERSON: 'thirdPerson',
	FIRST_PERSON: 'firstPerson',
	PLANET: 'planet'
};

const CAMERA_CONFIGS = {
	[CAMERA_MODES.THIRD_PERSON]: {
		sensitivity: 0.002,
		minPitch: -1.5,
		maxPitch: 0.3,
		autoCenter: true
	},
	[CAMERA_MODES.FIRST_PERSON]: {
		sensitivity: 0.001,
		minPitch: -1.0,
		maxPitch: 1.0,
		autoCenter: false
	},
	[CAMERA_MODES.PLANET]: {
		sensitivity: 0.0035,
		minPitch: -Math.PI / 2,
		maxPitch: Math.PI / 2,
		autoCenter: false
	}
};

export default class Game {
	constructor(scene, renderer, debug = false) {
		this.scene = scene;
		this.renderer = renderer;
		this.input = new InputHandler();

		this._initLighting();
		this._initSystem();
		this._initPlayer();
		this._initCameras();
		this._initControllers();
		this._initResizeHandler();

		this.setCameraMode('system');

		if (debug) this._activateDebugMode();
		this.renderer.setAnimationLoop(() => this.update());
	}

	update() {
		this.planets.forEach((p) => p.move());

		if (this.cameraMode === CAMERA_MODES.THIRD_PERSON || this.cameraMode === CAMERA_MODES.FIRST_PERSON) {
			this.player.update();
			this.playerController.update();
		}

		// Handle camera mode changes
		if (this.input.isTapped(CONTROLS.CYCLE_CAMERA)) {
			this.cycleCameraMode();
		}

		// Handle planet change
		for (let i = 0; i < this.planets.length; i++) {
			if (this.input.isTapped(`${CONTROLS.PLANET_PREFIX}${i + 1}`)) {
				this.changePlanet(i);
			}
		}

		// Handle camera movement
		if (this.cameraMode !== CAMERA_MODES.SYSTEM && this.activeCameraController) {
			this.activeCameraController.update(this.player.isMoving);
		}

		// TODO: Generalize System camera into CameraRig??
		const activeCamera = (this.cameraMode === CAMERA_MODES.SYSTEM) ? this.systemCamera : this.cameraRig.camera;
		this.renderer.render(this.scene, activeCamera);

		this.input.afterUpdate();
	}

	setCameraMode(mode) {
		this.cameraMode = mode;

		if (this.cameraControllers[mode]) {
			this.activeCameraController = this.cameraControllers[mode];
		} else {
			this.activeCameraController = null;
		}

		switch (this.cameraMode) {
			case CAMERA_MODES.THIRD_PERSON:
				this.player.attachToModel(this.cameraRig);
				this.cameraRig.setPosition(0, this.player.height * 0.8, 0);
				this.cameraRig.setCameraPosition(0, this.player.height * 2, this.player.height * 6);
				break;

			case CAMERA_MODES.FIRST_PERSON:
				this.player.attachToModel(this.cameraRig);
				this.cameraRig.setPosition(0, this.player.height * 0.8, 0);
				this.cameraRig.setCameraPosition(0, 0, 0);
				break;

			case CAMERA_MODES.PLANET:
				this.currentPlanet.addToSurface(this.cameraRig);
				this.cameraRig.setPosition(0, 0, 0);
				this.cameraRig.setCameraPosition(0, 0, this.currentPlanet.radius * 2);
				break;

			case CAMERA_MODES.SYSTEM:
				this.cameraRig.addTo(this.scene);
				break;
		}
	}

	cycleCameraMode() {
		const modesArray = Object.values(CAMERA_MODES);
		const i = modesArray.indexOf(this.cameraMode);
		this.setCameraMode(modesArray[(i + 1) % modesArray.length]);
	}

	changePlanet(planetIndex) {
		if (this.cameraMode === CAMERA_MODES.SYSTEM) return;

		this.currentPlanet = this.planets[planetIndex];
		this.player.moveToPlanet(this.currentPlanet);
		this.setCameraMode(this.cameraMode); // Refresh the rig parenting
	}

	_initLighting() {
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
		this.scene.add(this.ambientLight);
	}

	_initSystem() {
		// Star
		this.star = new Star({
			radius: 4,
			color: 0xebe5c7
		});

		this.star.addTo(this.scene);
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
				orbitSpeed: 0.001,
				orbitAngle: 2,
				orbitInclination: -10,
				rotationSpeed: 0.1522,
				rotationAxis: 23
			})
		];

		this.planets.forEach((p) => p.addTo(this.scene))
		this.currentPlanet = this.planets[1];
	}

	_initPlayer() {
		this.player = new Player({ height: 0.1, speed: 0.015 });
		this.player.moveToPlanet(this.currentPlanet);
	}

	_initControllers() {
		this.playerController = new PlayerController({ player: this.player, input: this.input });

		this.cameraControllers = {
			thirdPerson: new CameraController({
				cameraRig: this.cameraRig,
				input: this.input,
				config: CAMERA_CONFIGS.THIRD_PERSON
			}),
			firstPerson: new CameraController({
				cameraRig: this.cameraRig,
				input: this.input,
				config: CAMERA_CONFIGS.FIRST_PERSON
			}),
			planet: new CameraController({
				cameraRig: this.cameraRig,
				input: this.input,
				config: CAMERA_CONFIGS.PLANET
			})
		};

		this.activeCameraController = this.cameraControllers.thirdPerson;
	}

	_initCameras() {
		this.systemCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.systemCamera.position.z = 70;

		this.cameraRig = new CameraRig();

		// Orbit Controls
		this.orbitControls = new OrbitControls(this.systemCamera, this.renderer.domElement);
		this.orbitControls.update();
	}

	_initResizeHandler() {
		window.addEventListener('resize', () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const aspect = width / height;

			this.renderer.setSize(width, height);

			[this.systemCamera, this.cameraRig.camera].forEach(cam => {
				cam.aspect = aspect;
				cam.updateProjectionMatrix();
			});
		})
	}

	_activateDebugMode() {
		this.planets.forEach((p) => { p.activateDebugMode() });
		this.player.activateDebugMode();
	}

}

