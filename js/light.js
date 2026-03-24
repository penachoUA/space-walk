import * as THREE from 'three';

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(3, 5, 3);

export { ambientLight, sunLight };
