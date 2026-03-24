import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderer, scene } from './scene.js';
import { camera } from './camera.js';
import { ambientLight, sunLight } from './light.js'
import Planet from './Planet.js'

// Add lighting
scene.add(ambientLight);
scene.add(sunLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Planet
const planet = new Planet(1, 64, 64, 0x44aaff);
scene.add(planet);

// Animation
function animate() {
	sunLight.position.x = Math.sin(Date.now() * 0.001) * 5;
	sunLight.position.z = Math.cos(Date.now() * 0.001) * 5;
	controls.update();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})
