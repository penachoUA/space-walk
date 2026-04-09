import * as THREE from 'three';
import { renderer, scene } from './core/scene.js';
import Game from './core/Game.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

new RGBELoader().load('../assets/skybox.hdr', (texture) => {
	texture.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = texture;
	new Game(scene, renderer);
});
