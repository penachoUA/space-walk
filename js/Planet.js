import * as THREE from 'three';

class Planet extends THREE.Object3D {
	constructor(radius, widthSeg, heightSeg, color) {
		super();
		const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
		const material = new THREE.MeshStandardMaterial({ color });
		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);
	}
}

export default Planet;
