document.addEventListener("DOMContentLoaded", (event) => {
	console.log("Fluid simulation script loaded");

	const canvas = document.getElementById("fluidCanvas");
	const ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	console.log("Canvas size:", canvas.width, canvas.height);

	let PARTICLE_RADIUS = 4;
	let PARTICLE_COUNT = 500;
	let GRAVITY = 0.15;
	let FRICTION = 0.99;
	let INTERACTION_RADIUS = 50;
	let COHESION_FORCE = 0.01;
	let SEPARATION_FORCE = 0.02;
	let GRID_SIZE = 5;
	let prevWindowX = window.screenX;
	let prevWindowY = window.screenY;
	let lastFrameTime = performance.now();
	let frameRate = 60;

	const controlPanelButton = document.getElementById('controlPanelButton');
	const controlPanel = document.getElementById('controlPanel');
	const applySettingsButton = document.getElementById('applySettings');

	controlPanelButton.addEventListener('click', () => {
		controlPanel.style.display = controlPanel.style.display === 'none' ? 'block' : 'none';
	});

	applySettingsButton.addEventListener('click', () => {
		PARTICLE_RADIUS = parseInt(document.getElementById('particleRadius').value);
		PARTICLE_COUNT = parseInt(document.getElementById('particleCount').value);
		GRAVITY = parseFloat(document.getElementById('gravity').value);
		FRICTION = parseFloat(document.getElementById('friction').value);
		INTERACTION_RADIUS = parseInt(document.getElementById('interactionRadius').value);
		COHESION_FORCE = parseFloat(document.getElementById('cohesionForce').value);
		SEPARATION_FORCE = parseFloat(document.getElementById('separationForce').value);
		GRID_SIZE = parseInt(document.getElementById('gridSize').value);

		// Reinitialize particles with the new count
		initializeParticles();

		controlPanel.style.display = 'none';
	});

	class Particle {
		constructor(x, y, vx, vy) {
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.radius = PARTICLE_RADIUS;
		}

		applyForce(fx, fy) {
			this.vx += fx;
			this.vy += fy;
		}

		update() {
			// Apply gravity
			this.vy += GRAVITY;

			// Apply friction
			this.vx *= FRICTION;
			this.vy *= FRICTION;

			// Update position
			this.x += this.vx;
			this.y += this.vy;

			// Boundary collision detection
			if (this.y + this.radius > canvas.height) {
				this.y = canvas.height - this.radius;
				this.vy *= -0.6; // bounce effect
			}

			if (this.y - this.radius < 0) {
				this.y = this.radius;
				this.vy *= -0.6; // bounce effect
			}

			if (this.x - this.radius < 0) {
				this.x = this.radius;
				this.vx *= -0.6; // bounce effect
			}
			if (this.x + this.radius > canvas.width) {
				this.x = canvas.width - this.radius;
				this.vx *= -0.6; // bounce effect
			}
		}
	}

	let particles = [];

	// Initialize particles
	function initializeParticles() {
		particles = [];
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * (canvas.height / 4) + (canvas.height * 3) / 4;
			const vx = (Math.random() - 0.5) * 2;
			const vy = (Math.random() - 0.5) * 2;
			particles.push(new Particle(x, y, vx, vy));
		}
	}

	initializeParticles();

	function applyInteractions() {
		const grid = {};

		// Create a spatial hash
		particles.forEach((p) => {
			const x = Math.floor(p.x / GRID_SIZE);
			const y = Math.floor(p.y / GRID_SIZE);
			const key = `${x},${y}`;
			if (!grid[key]) {
				grid[key] = [];
			}
			grid[key].push(p);
		});

		particles.forEach((p1) => {
			const x = Math.floor(p1.x / GRID_SIZE);
			const y = Math.floor(p1.y / GRID_SIZE);

			// Check neighboring cells
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					const key = `${x + i},${y + j}`;
					if (grid[key]) {
						grid[key].forEach((p2) => {
							if (p1 !== p2) {
								const dx = p2.x - p1.x;
								const dy = p2.y - p1.y;
								const dist = Math.sqrt(dx * dx + dy * dy);
								if (dist < INTERACTION_RADIUS) {
									const angle = Math.atan2(dy, dx);
									const separation = INTERACTION_RADIUS - dist;
									const force =
										(separation > 0 ? SEPARATION_FORCE : COHESION_FORCE) *
										separation;
									const fx = Math.cos(angle) * force;
									const fy = Math.sin(angle) * force;

									p1.applyForce(-fx, -fy);
									p2.applyForce(fx, fy);
								}
							}
						});
					}
				}
			}
		});
	}

	function metaball(x, y, particles) {
		let value = 0;
		for (const p of particles) {
			const dx = x - p.x;
			const dy = y - p.y;
			const distSquared = dx * dx + dy * dy;
			value += 1 / distSquared;
		}
		return value;
	}

	function drawFluid() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const imageData = ctx.createImageData(canvas.width, canvas.height);
		const data = imageData.data;

		for (let y = 0; y < canvas.height; y += GRID_SIZE) {
			for (let x = 0; x < canvas.width; x += GRID_SIZE) {
				const value = metaball(x, y, particles);
				if (value > 0.01) {
					const alpha = Math.min(value * 10000, 255); // Scale alpha based on value
					for (let dy = 0; dy < GRID_SIZE; dy++) {
						for (let dx = 0; dx < GRID_SIZE; dx++) {
							const index = ((y + dy) * canvas.width + (x + dx)) * 4;
							data[index] = 173; // R
							data[index + 1] = 216; // G
							data[index + 2] = 230; // B
							data[index + 3] = alpha; // A
						}
					}
				}
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}

	function applyWindowMovementForce() {
		const currentWindowX = window.screenX;
		const currentWindowY = window.screenY;

		const dx = currentWindowX - prevWindowX;
		const dy = currentWindowY - prevWindowY;

		if (dx !== 0 || dy !== 0) {
			const forceX = dx * 0.1;
			const forceY = dy * 0.1;

			particles.forEach((particle) => {
				particle.applyForce(forceX, forceY);
			});

			prevWindowX = currentWindowX;
			prevWindowY = currentWindowY;
		}
	}

	function adjustGridSizeBasedOnFrameRate() {
		const now = performance.now();
		const delta = now - lastFrameTime;
		lastFrameTime = now;

		// Calculate frame rate
		frameRate = 1000 / delta;

		// Adjust grid size and particle radius based on frame rate
		if (frameRate < 30) {
			GRID_SIZE = Math.min(GRID_SIZE + 1, 20);
			PARTICLE_RADIUS = Math.min(PARTICLE_RADIUS + 1, 10);
		} else if (frameRate > 60) {
			GRID_SIZE = Math.max(GRID_SIZE - 1, 5);
			PARTICLE_RADIUS = Math.max(PARTICLE_RADIUS - 1, 2);
		}

		// Update particle radii
		particles.forEach((particle) => {
			particle.radius = PARTICLE_RADIUS;
		});
	}

	function animate() {
		adjustGridSizeBasedOnFrameRate();
		applyInteractions();
		applyWindowMovementForce();

		particles.forEach((particle) => {
			particle.update();
		});

		drawFluid();

		requestAnimationFrame(animate);
	}

	animate();

	// Handle window resize
	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	// Handle window movement
	window.addEventListener("mousemove", applyWindowMovementForce);
});
