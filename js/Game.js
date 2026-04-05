import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import Planet from './Planet.js';
import Star from './Star.js';
import Player from './Player.js';
import CameraController from './CameraController.js';

class Game {
	constructor(debug = false) {
		this.surfaceMode = false;

		this._initLighting();
		this._initSystem();
		this._initPlayer();
		this._initSystemCamera();
		this._initEventListeners();

		if (debug) this._activateDebugMode();

		renderer.setAnimationLoop(() => this.update());
	}

	update() {
		this.planets.forEach((p) => p.move());

		if (this.keys['KeyW'] || this.keys['ArrowUp']) this.player.move(1);
		if (this.keys['KeyS'] || this.keys['ArrowDown']) this.player.move(-1);
		if (this.keys['KeyA'] || this.keys['ArrowLeft']) this.player.turn(1);
		if (this.keys['KeyD'] || this.keys['ArrowRight']) this.player.turn(-1);

		this.playerCamera.update();

		renderer.render(scene, this.surfaceMode ? this.player.camera : this.camera);
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
		this.currentPlanet = this.planets[0];
	}

	_initPlayer() {
		this.player = new Player(0.1, 0.015);
		this.player.moveToPlanet(this.currentPlanet);
	}

	_initSystemCamera() {
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.camera.position.z = 70;

		this.playerCamera = new CameraController(this.player);

		// Orbit Controls
		this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
		this.orbitControls.update();
	}

	_initEventListeners() {
		this.keys = {};

		// Mouse input
		window.addEventListener('mousedown', (e) => {
			if (!this.surfaceMode) return;
			this.playerCamera.onMouseDown(e);
		});

		window.addEventListener('mouseup', (e) => {
			this.playerCamera.onMouseUp(e);
		});

		window.addEventListener('mouseleave', () => {
			this.playerCamera.isDragging = false;
		});

		window.addEventListener('mousemove', (e) => {
			if (!this.surfaceMode) return;
			this.playerCamera.onMouseMove(e);
		});

		// Keyboard input
		window.addEventListener('keydown', (e) => {
			this.keys[e.code] = true;

			if (e.code === 'Space') {
				this.surfaceMode = !this.surfaceMode;
			}
			if (e.code === 'KeyV') this.player.toggleCamera();
		});

		window.addEventListener('keyup', (e) => this.keys[e.code] = false);

		// Window resizing
		window.addEventListener('resize', () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const aspect = width / height;

			renderer.setSize(width, height);

			// List all cameras that need updating
			[this.camera, this.player.camera].forEach(cam => {
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

