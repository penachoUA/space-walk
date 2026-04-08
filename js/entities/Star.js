import * as THREE from 'three';

const CONFIG = {
	SEGMENTS: 24,
	EMISSIVE_INTENSITY: 100.0,
	LIGHT: {
		COLOR: 0xffffff,
		INTENSITY: 100,
		DISTANCE: 0,
		DECAY: 2
	}
};

class Star extends THREE.Object3D {
	constructor({ radius, color }) {
		super();

		const geometry = new THREE.SphereGeometry(radius, CONFIG.SEGMENTS, CONFIG.SEGMENTS);
		const material = new THREE.MeshToonMaterial({
			color,
			emissive: color,
			emissiveIntensity: CONFIG.EMISSIVE_INTENSITY,
		});
		this.radius = radius;

		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		this.light = new THREE.PointLight(
			CONFIG.LIGHT.COLOR,
			CONFIG.LIGHT.INTENSITY,
			CONFIG.LIGHT.DISTANCE,
			CONFIG.LIGHT.DECAY
		);
		this.add(this.light);
	}
}

export default Star;
