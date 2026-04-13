import * as THREE from 'three';

const CONFIG = {
	SEGMENTS: 24,
	EMISSIVE_INTENSITY: 100.0,
	LIGHT: {
		COLOR: 0xffffff,
		INTENSITY: 100,
		DISTANCE: 0,
		DECAY: 1.5
	}
};

export default class Star {
	constructor({ radius, color }) {
		this.root = new THREE.Object3D();

		const geometry = new THREE.SphereGeometry(radius, CONFIG.SEGMENTS, CONFIG.SEGMENTS);
		const material = new THREE.MeshToonMaterial({
			color,
			emissive: color,
			emissiveIntensity: CONFIG.EMISSIVE_INTENSITY,
		});
		this.radius = radius;

		this.mesh = new THREE.Mesh(geometry, material);
		this.root.add(this.mesh);

		this.light = new THREE.PointLight(
			CONFIG.LIGHT.COLOR,
			CONFIG.LIGHT.INTENSITY,
			CONFIG.LIGHT.DISTANCE,
			CONFIG.LIGHT.DECAY
		);
		this.root.add(this.light);
	}

	addTo(parent) {
		parent.add(this.root);
		return this;
	}
}

