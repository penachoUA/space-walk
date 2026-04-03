import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import Planet from './Planet.js';
import Star from './Star.js';
import Player from './Player.js';

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Star
const star = new Star({
	radius: 4,
	color: 0xebe5c7
});

scene.add(star);
// Planets
const planets = [
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

planets.forEach((p) => scene.add(p))
planets.forEach((p) => p.activateDebugMode());

// Add camera on planet surface
const target = planets[0];
const marker = new THREE.Mesh(
	new THREE.SphereGeometry(0.1, 8, 8),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
marker.position.set(0, planets[0].radius + 0.1, 0); // north pole
planets[0].add(marker);
const player = new Player(target);
player.activateDebugMode();

// Camera mode toggle
let surfaceMode = true;
const overviewCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
overviewCamera.position.z = 70;

// Orbit Controls
const controls = new OrbitControls(overviewCamera, renderer.domElement);
controls.update();
controls.addEventListener('change', () => renderer.render(scene, overviewCamera));

window.addEventListener('keydown', (e) => {
	if (e.code === 'Space') {
		surfaceMode = !surfaceMode;
		controls.enabled = !surfaceMode;
	}
	if (e.code === 'KeyV') player.toggleCamera();
});

const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function animate() {
	planets.forEach((p) => p.move());

	if (keys['KeyW'] || keys['ArrowUp']) player.moveForward(1);
	if (keys['KeyS'] || keys['ArrowDown']) player.moveForward(-1);
	if (keys['KeyA'] || keys['ArrowLeft']) player.turn(0.02);
	if (keys['KeyD'] || keys['ArrowRight']) player.turn(-0.02);

	renderer.render(scene, surfaceMode ? player.camera : overviewCamera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);

	player.camera.aspect = window.innerWidth / window.innerHeight;
	player.camera.updateProjectionMatrix();

	overviewCamera.aspect = window.innerWidth / window.innerHeight;
	overviewCamera.updateProjectionMatrix();
})
