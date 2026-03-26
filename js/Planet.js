import * as THREE from 'three';

class Planet extends THREE.Object3D {
	constructor({ radius, color, orbitRadius, orbitSpeed, orbitAngle, orbitInclination, rotationSpeed, rotationAxis }) {
		super();

		const segments = Math.floor(radius * 50);
		const geometry = new THREE.SphereGeometry(radius, segments, segments);
		const material = new THREE.MeshStandardMaterial({ color });
		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		// Orbit
		this.orbitRadius = orbitRadius;
		this.orbitSpeed = orbitSpeed;
		this.orbitAngle = orbitAngle;
		this.orbitInclination = orbitInclination * (Math.PI / 180); // Convert to radians

		// Rotation
		this.mesh.rotation.z = rotationAxis * (Math.PI / 180);
		this.rotationSpeed = rotationSpeed;

		this.mesh.material.wireframe = true;
	}

	move() {
		this.orbit();
		this.rotate();
	}

	orbit() {
		this.orbitAngle += this.orbitSpeed;
		this.position.x = Math.sin(this.orbitAngle) * this.orbitRadius;
		this.position.y = Math.sin(this.orbitAngle) * this.orbitRadius * Math.sin(this.orbitInclination);
		this.position.z = Math.cos(this.orbitAngle) * this.orbitRadius;
	}

	rotate() {
		this.mesh.rotation.y += this.rotationSpeed;
	}
}

export default Planet;
