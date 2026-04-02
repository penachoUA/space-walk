import * as THREE from 'three';

class Star extends THREE.Object3D {
	constructor({ radius, color }) {
		super();

		const segments = 24;
		const geometry = new THREE.SphereGeometry(radius, segments, segments);
		const material = new THREE.MeshToonMaterial({
			color,
			emissive: color,
			emissiveIntensity: 1.0
		});
		this.radius = radius;

		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		this.light = new THREE.PointLight(0xffffff, 100, 0, 2);
		this.add(this.light);
	}
}

export default Star;
