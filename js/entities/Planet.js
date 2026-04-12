import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

const CONFIG = {
	SPHERE_SEGMENTS: 32,
	ORBIT_LINE_SEGMENTS: 128,
	AXES_SIZE: 3,
	DEBUG_OPACITY: 0.5
};

export default class Planet {
	constructor({
		radius,
		color1,
		color2,
		color3,
		orbitRadius,
		orbitSpeed,
		orbitAngle,
		orbitInclination,
		rotationSpeed,
		rotationAxis
	}) {
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
		const texture = Planet._generateTexture(color1, color2, color3);
		const material = new THREE.MeshToonMaterial({ map: texture });
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
		object.addTo(this.mesh);
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

	static _generateTexture(color1, color2, color3) {
		const noise2D = createNoise2D();
		const size = 512;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');

		const low = new THREE.Color(color1);
		const mid = new THREE.Color(color2);
		const high = new THREE.Color(color3);

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const t = (noise2D(x * 0.02, y * 0.02) + 1) / 2;
				let r, g, b;
				if (t < 0.4) {
					const s = t / 0.4;
					r = low.r + (mid.r - low.r) * s;
					g = low.g + (mid.g - low.g) * s;
					b = low.b + (mid.b - low.b) * s;
				} else {
					const s = (t - 0.4) / 0.6;
					r = mid.r + (high.r - mid.r) * s;
					g = mid.g + (high.g - mid.g) * s;
					b = mid.b + (high.b - mid.b) * s;
				}
				ctx.fillStyle = `rgb(${Math.floor(r * 255)},${Math.floor(g * 255)},${Math.floor(b * 255)})`;
				ctx.fillRect(x, y, 1, 1);
			}
		}
		return new THREE.CanvasTexture(canvas);
	}
}

