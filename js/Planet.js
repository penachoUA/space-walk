import * as THREE from 'three';

class Planet extends THREE.Object3D {
	constructor(radius, widthSeg, heightSeg, color, orbitRadius, orbitSpeed, orbitAngle) {
		super();
		const geometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
		const material = new THREE.MeshStandardMaterial({ color });
		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		this.orbitRadius = orbitRadius;
		this.orbitSpeed = orbitSpeed;
		this.orbitAngle = orbitAngle;
	}

	orbit() {
		this.orbitAngle += this.orbitSpeed;
		this.position.x = Math.sin(this.orbitAngle) * this.orbitRadius;
		this.position.z = Math.cos(this.orbitAngle) * this.orbitRadius;
	}
}

export default Planet;
