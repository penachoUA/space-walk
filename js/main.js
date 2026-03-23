import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(3, 5, 3);
scene.add(sunLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x44aaff });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Animation
function animate() {
	sunLight.position.x = Math.sin(Date.now() * 0.001) * 5;
	sunLight.position.z = Math.cos(Date.now() * 0.001) * 5;
	controls.update();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
