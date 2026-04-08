import * as THREE from 'three';

const CONFIG = {
	SPHERE_SEGMENTS: 32,
	ORBIT_LINE_SEGMENTS: 128,
	PLANET_AXES_SIZE: 5,
	MESH_AXES_SIZE: 3,
	DEBUG_OPACITY: 0.5
};

export default class Planet extends THREE.Object3D {
	constructor({ radius, color, orbitRadius, orbitSpeed, orbitAngle, orbitInclination, rotationSpeed, rotationAxis }) {
		super();

		const geometry = new THREE.SphereGeometry(radius, CONFIG.SPHERE_SEGMENTS, CONFIG.SPHERE_SEGMENTS);
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
		this.orbitPath = null;
		this.debug = new THREE.Object3D();
		this.add(this.debug);
		this.debug.visible = false;
	}

	move() {
		this._orbit();
		this._rotate();
	}

	activateDebugMode() {
		if (this.debug.children.length === 0) {
			const planetAxes = new THREE.AxesHelper(this.radius + CONFIG.PLANET_AXES_SIZE);
			this.debug.add(planetAxes);

			const meshAxes = new THREE.AxesHelper(this.radius + CONFIG.MESH_AXES_SIZE);
			this.mesh.add(meshAxes);

			this._createSurfaceGrid();
			this._createOrbitPath();

			this.mesh.material.wireframe = true;
			this.debug.visible = true;
		}
	}

	_orbit() {
		this.orbitAngle += this.orbitSpeed;
		this.position.x = Math.sin(this.orbitAngle) * this.orbitRadius;
		this.position.y = Math.sin(this.orbitAngle) * this.orbitRadius * Math.sin(this.orbitInclination);
		this.position.z = Math.cos(this.orbitAngle) * this.orbitRadius;
	}

	_rotate() {
		this.mesh.rotation.y += this.rotationSpeed;
	}

	_createSurfaceGrid() {
		const edges = new THREE.EdgesGeometry(this.mesh.geometry);

		const count = edges.attributes.position.count;
		const colors = new Float32Array(count * 3); // (R,G,B) per vertex
		const positions = edges.attributes.position.array;

		const tempColor = new THREE.Color();

		for (let vertex = 0; vertex < count; vertex++) {
			const vertexY = positions[vertex * 3 + 1];
			const t = (vertexY + this.radius) / (2 * this.radius);

			tempColor.setHSL(t, 1, CONFIG.DEBUG_OPACITY);

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

	_createOrbitPath() {
		const segments = CONFIG.ORBIT_LINE_SEGMENTS;
		const points = [];

		for (let i = 0; i <= segments; i++) {
			const angle = (i / segments) * Math.PI * 2;

			const x = Math.sin(angle) * this.orbitRadius;
			const y = Math.sin(angle) * this.orbitRadius * Math.sin(this.orbitInclination);
			const z = Math.cos(angle) * this.orbitRadius;

			points.push(new THREE.Vector3(x, y, z));
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({
			color: this.mesh.material.color,
			transparent: true,
			opacity: CONFIG.DEBUG_OPACITY,
		});

		this.orbitPath = new THREE.LineLoop(geometry, material);
	}
}

