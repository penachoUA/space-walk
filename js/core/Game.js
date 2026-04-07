import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import Planet from '../entities/Planet.js';
import Star from '../entities/Star.js';
import Player from '../entities/Player.js';
import CameraRig from '../camera/CameraRig.js';

class Game {
	constructor(debug = false) {
		this._initLighting();
		this._initSystem();
		this._initPlayer();
		this._initCameras();
		this._initEventListeners();

		this.setCameraMode('system');

		if (debug) this._activateDebugMode();
		renderer.setAnimationLoop(() => this.update());
	}

	update() {
		this.player.isMoving = false;

		this.planets.forEach((p) => p.move());

		if (this.cameraMode === 'surface') {
			if (this.keys['KeyW'] || this.keys['ArrowUp']) this.player.move(1);
			if (this.keys['KeyS'] || this.keys['ArrowDown']) this.player.move(-1);
			if (this.keys['KeyA'] || this.keys['ArrowLeft']) this.player.turn(1);
			if (this.keys['KeyD'] || this.keys['ArrowRight']) this.player.turn(-1);
		}

		this.cameraRig.update(this.player.isMoving);

		const activeCamera = (this.cameraMode === 'system') ? this.systemCamera : this.cameraRig.camera;
		renderer.render(scene, activeCamera);
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

	_initCameras() {
		this.systemCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.systemCamera.position.z = 70;

		this.cameraRig = new CameraRig();

		// Orbit Controls
		this.orbitControls = new OrbitControls(this.systemCamera, renderer.domElement);
		this.orbitControls.update();
	}

	_initEventListeners() {
		this.keys = {};

		// Mouse input
		window.addEventListener('mousedown', (e) => {
			if (this.cameraMode === 'system') return;
			this.cameraRig.onMouseDown(e);
		});

		window.addEventListener('mouseup', (e) => {
			if (this.cameraMode === 'system') return;
			this.cameraRig.onMouseUp(e);
		});

		window.addEventListener('mouseleave', () => {
			this.cameraRig.isDragging = false;
		});

		window.addEventListener('mousemove', (e) => {
			if (this.cameraMode === 'system') return;
			this.cameraRig.onMouseMove(e);
		});

		// Keyboard input
		window.addEventListener('keydown', (e) => {
			this.keys[e.code] = true;

			if (e.code === 'Space') {
				if (this.cameraMode === 'system') {
					this.setCameraMode('surface');
				} else {
					this.setCameraMode('system');
				}
			}

			if (e.code === 'KeyM') {
				if (this.cameraMode == 'system') return;
				this.cameraMode === 'surface' ?
					this.setCameraMode('planet') :
					this.setCameraMode('surface');
			}
			// Jump between planets
			if (e.code.startsWith("Digit")) {
				const number = parseInt(e.code.replace('Digit', '')) - 1;
				if (number >= 0 && number < this.planets.length) {
					this.currentPlanet = this.planets[number];

					this.player.moveToPlanet(this.currentPlanet);
					this.setCameraMode(this.cameraMode);
				}
			}
		});

		window.addEventListener('keyup', (e) => this.keys[e.code] = false);

		// Window resizing
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

	setCameraMode(mode) {
		this.cameraMode = mode;

		if (mode === 'surface') {
			this.player.playerModel.add(this.cameraRig);
			this.cameraRig.position.set(0, this.player.height * 0.8, 0);
			this.cameraRig.camera.position.set(0, this.player.height * 2, this.player.height * 6);
			this.orbitControls.enabled = false;
		}
		else if (mode === 'planet') {
			// TODO: Add more freedom and sensitivity
			this.currentPlanet.add(this.cameraRig);
			this.cameraRig.position.set(0, 0, 0);
			this.cameraRig.camera.position.set(0, 0, this.currentPlanet.radius * 2);
			this.orbitControls.enabled = false;
		}
		else if (mode === 'system') {
			scene.add(this.cameraRig);
			this.orbitControls.enabled = true;
		}
	}
}
export default Game;

