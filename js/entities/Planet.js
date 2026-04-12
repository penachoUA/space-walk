import * as THREE from 'three';

const CONFIG = {
	SPHERE_SEGMENTS: 32,
	ORBIT_LINE_SEGMENTS: 128,
	AXES_SIZE: 3,
	DEBUG_OPACITY: 0.5
};

export default class Planet {
	constructor({ radius, color, orbitRadius, orbitSpeed, orbitAngle, orbitInclination, rotationSpeed, rotationAxis }) {
		// Root handles orbital inclination — tilting the entire orbit plane
		this.root = new THREE.Object3D();
		this.root.rotation.z = orbitInclination * (Math.PI / 180);

		// orbitPivot rotates around Y each frame to move the planet around the star
		this.orbitPivot = new THREE.Object3D();
		this.root.add(this.orbitPivot);

		// axisTilt offsets the planet to its orbital radius and applies axial tilt
		this.axisTilt = new THREE.Object3D();
		this.axisTilt.position.x = orbitRadius;
		this.axisTilt.rotation.z = rotationAxis * (Math.PI / 180);
		this.orbitPivot.add(this.axisTilt);

		// Setup visual, mesh is the surface of the planet
		const geometry = new THREE.SphereGeometry(radius, CONFIG.SPHERE_SEGMENTS, CONFIG.SPHERE_SEGMENTS);
		const material = new THREE.MeshToonMaterial({ color, map: this._createGridTexture() });
		this.mesh = new THREE.Mesh(geometry, material);
		this.axisTilt.add(this.mesh);

		this.radius = radius;
		this.orbitSpeed = orbitSpeed;
		this.orbitAngle = orbitAngle;
		this.rotationSpeed = rotationSpeed;
		this._orbitRadius = orbitRadius;

		this.orbitPath = null;
	}

	addTo(parent) {
		parent.add(this.root);
		return this;
	}

	addToSurface(object) {
		this.mesh.add(object);
	}

	removeFromSurface(object) {
		this.mesh.remove(object);
	}

	move() {
		this._orbit();
		this._rotate();
	}

	activateDebugMode() {
		// Spinning axes — on mesh which only rotates around Y, should be clean now
		this._spinAxes = new THREE.AxesHelper(this.radius + CONFIG.AXES_SIZE);
		this.mesh.add(this._spinAxes);

		// Surface grid — on mesh so it stays fixed relative to player
		this._createSurfaceGrid();

		// Orbit path — on root so it inherits orbital inclination
		this._createOrbitPath();
		this.root.add(this.orbitPath);

		this.mesh.material.wireframe = true;
	}

	_orbit() {
		this.orbitAngle += this.orbitSpeed;
		this.orbitPivot.rotation.y = this.orbitAngle;
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
		this.mesh.add(line);
		this._surfaceGrid = line;
	}

	_createOrbitPath() {
		const segments = CONFIG.ORBIT_LINE_SEGMENTS;
		const points = [];

		for (let i = 0; i <= segments; i++) {
			const angle = (i / segments) * Math.PI * 2;
			points.push(new THREE.Vector3(
				Math.sin(angle) * this._orbitRadius,
				0,
				Math.cos(angle) * this._orbitRadius
			));
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({
			color: this.mesh.material.color,
			transparent: true,
			opacity: CONFIG.DEBUG_OPACITY,
		});

		this.orbitPath = new THREE.LineLoop(geometry, material);
	}

	_createGridTexture() {
		const size = 512;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, size, size);

		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 2;
		const divisions = 8;
		const step = size / divisions;

		for (let i = 0; i <= divisions; i++) {
			ctx.beginPath();
			ctx.moveTo(i * step, 0);
			ctx.lineTo(i * step, size);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0, i * step);
			ctx.lineTo(size, i * step);
			ctx.stroke();
		}

		return new THREE.CanvasTexture(canvas);
	}
}

