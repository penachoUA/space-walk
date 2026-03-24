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
const planet = new Planet(1, 64, 64, 0x44aaff);
scene.add(planet);
planet.position.y = 5;

// Animation
function animate() {
	controls.update();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})
