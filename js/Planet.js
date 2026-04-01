import * as THREE from 'three';

class Planet extends THREE.Object3D {
	constructor({ radius, color, orbitRadius, orbitSpeed, orbitAngle, orbitInclination, rotationSpeed, rotationAxis }) {
		super();

		const segments = 32;
		const geometry = new THREE.SphereGeometry(radius, segments, segments);
		const material = new THREE.MeshStandardMaterial({ color });
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
		this.surfaceGrid = new THREE.Object3D();

		let latSegments = 16;
		let longSegments = 64;
		for (let latIndex = 0; latIndex <= latSegments; latIndex++) {
			const lat = (latIndex / latSegments) * Math.PI;

			const y = Math.cos(lat) * this.radius;
			const ringRadius = Math.sin(lat) * this.radius;

			const points = [];
			for (let i = 0; i < longSegments; i++) {
				const angle = (i / longSegments) * 2 * Math.PI;
				const x = Math.cos(angle) * ringRadius;
				const z = Math.sin(angle) * ringRadius;

				points.push(new THREE.Vector3(x, y, z));

			}
			const t = (y + this.radius) / (2 * this.radius);
			const material = new THREE.LineBasicMaterial({
				color: new THREE.Color().setHSL(t, 1, 0.5)
			});

			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			const ring = new THREE.LineLoop(geometry, material);
			this.surfaceGrid.add(ring);
		}

		longSegments = 16;
		latSegments = 64;

		for (let longIndex = 0; longIndex <= longSegments; longIndex++) {

			const lon = (longIndex / longSegments) * Math.PI * 2;

			const points = [];

			for (let latIndex = 0; latIndex <= latSegments; latIndex++) {

				const lat = (latIndex / latSegments) * Math.PI;

				const x = Math.sin(lat) * Math.cos(lon) * this.radius;
				const y = Math.cos(lat) * this.radius;
				const z = Math.sin(lat) * Math.sin(lon) * this.radius;

				points.push(new THREE.Vector3(x, y, z));
			}

			const t = (longIndex / longSegments);
			const material = new THREE.LineBasicMaterial({
				color: new THREE.Color().setHSL(t, 1, 0.5)
			});

			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			const line = new THREE.Line(geometry, material);

			this.surfaceGrid.add(line);
		}
		this.debug.add(this.surfaceGrid);
	}
}

export default Planet;
