import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import { camera } from './camera.js';
import Planet from './Planet.js';
import Star from './Star.js';

// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Star
const star = new Star({
	radius: 2,
	color: 0xebe5c7
});
scene.add(star);

// Planet
const planets = [
	new Planet({
		radius: 1,
		color: 0x44aaff,
		orbitRadius: 10,
		orbitSpeed: 0.02,
		orbitAngle: 0,
		orbitInclination: 15
	}),
	new Planet({
		radius: 2,
		color: 0x2e8c20,
		orbitRadius: 21,
		orbitSpeed: 0.03,
		orbitAngle: 4,
		orbitInclination: 20
	}),
	new Planet({
		radius: 0.5,
		color: 0xa12ad1,
		orbitRadius: 4,
		orbitSpeed: 0.01,
		orbitAngle: 2,
		orbitInclination: -10
	})
];
planets.forEach((p) => scene.add(p))

// Animation
function animate() {
	planets.forEach((p) => p.orbit());
	controls.update();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})
