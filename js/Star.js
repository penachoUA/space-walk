import * as THREE from 'three';

class Star extends THREE.Object3D {
	constructor(radius, widthSeg, heightSeg, color) {
		super();
		const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
		const material = new THREE.MeshBasicMaterial({ color });
		const mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);

		this.light = new THREE.DirectionalLight(0xffffff, 1.5);
		this.add(this.light);
	}
}

export default Star;
