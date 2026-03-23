import * as THREE from 'three';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicMaterial({ color: 0x4444ff });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Animation
function animate() {
	sphere.rotation.y += 0.005;
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
