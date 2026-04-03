import * as THREE from 'three';

class Planet extends THREE.Object3D {
	constructor({ radius, color, orbitRadius, orbitSpeed, orbitAngle, orbitInclination, rotationSpeed, rotationAxis }) {
		super();

		const segments = 32;
		const geometry = new THREE.SphereGeometry(radius, segments, segments);
		const material = new THREE.MeshToonMaterial({ color });
		this.mesh = new THREE.Mesh(geometry, material);
		this.add(this.mesh);

		this.radius = radius;

		// Orbit
		this.orbitRadius = orbitRadius;
		this.orbitSpeed = orbitSpeed;
		this.orbitAngle = orbitAngle;
		this.orbitInclination = orbitInclination * (Math.PI / 180); // Convert to radians

		// Rotation
		this.mesh.rotation.z = rotationAxis * (Math.PI / 180);
		this.rotationSpeed = rotationSpeed;

		// Visual debugging features
		this.debug = new THREE.Object3D();
		this.add(this.debug);
		this.debug.visible = false;
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

	activateDebugMode() {
		if (this.debug.children.length === 0) {
			const planetAxes = new THREE.AxesHelper(this.radius + 5);
			this.debug.add(planetAxes);

			const meshAxes = new THREE.AxesHelper(this.radius + 3);
			this.mesh.add(meshAxes);

			this.createSurfaceGrid();

			this.mesh.material.wireframe = true;
			this.debug.visible = true;
		}
	}

	createSurfaceGrid() {
		const edges = new THREE.EdgesGeometry(this.mesh.geometry);

		const count = edges.attributes.position.count;
		const colors = new Float32Array(count * 3); // (R,G,B) per vertex
		const positions = edges.attributes.position.array;

		const tempColor = new THREE.Color();

		for (let vertex = 0; vertex < count; vertex++) {
			const vertexY = positions[vertex * 3 + 1];
			const t = (vertexY + this.radius) / (2 * this.radius);

			tempColor.setHSL(t, 1, 0.5);

			colors[vertex * 3] = tempColor.r;
			colors[vertex * 3 + 1] = tempColor.g;
			colors[vertex * 3 + 2] = tempColor.b;
		}

		edges.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const lineMaterial = new THREE.LineBasicMaterial({
			vertexColors: true
		});

		const line = new THREE.LineSegments(edges, lineMaterial);
		this.debug.add(line);
	}
}

export default Planet;
