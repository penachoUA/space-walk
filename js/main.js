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
const star = new Star(2, 64, 64, 0xebe5c7);
scene.add(star);

// Planet
const planets = [
	new Planet(1, 64, 64, 0x44aaff, 10, 0.02, 0, 15),
	new Planet(2, 64, 64, 0x2e8c20, 21, 0.03, 4, 20),
	new Planet(0.5, 16, 16, 0xa12ad1, 4, 0.01, 2, -10)
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
