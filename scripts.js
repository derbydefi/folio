document.addEventListener("DOMContentLoaded", (event) => {
	console.log("DOM fully loaded and parsed");

	// Centralized Project Data
	const projects = [
		{
			key: "project1",
			title: "fluid simulation",
			description:
				"This fluid simulation demonstrates fluid dynamics in a grid-based environment, utilizing a particle advection system. It incorporates key computational fluid dynamics (CFD) techniques, including the Navier-Stokes equations, to simulate realistic fluid movement. The integration method uses a combination of advection, diffusion, and pressure solving, with the simulation applying the Gauss-Seidel method for solving pressure equations.",
			image: "assets/fluid.png", // Change path as needed
			link: "https://derbydefi.github.io/navier-stokes/", // GitHub Pages link
		},
		{
			key: "project2",
			title: "cloth physics",
			description:
				"This Verlet-integrated cloth simulation models the behavior of a cloth-like material in a grid system by simulating particle interactions constrained by springs. The simulation uses a grid of particles connected by constraints to simulate the elasticity of the fabric. It also features gravity, mouse interaction for cutting and pinning, and a tearing mechanism when the cloth is stretched beyond a certain threshold.",
			image: "assets/verlet.png",
			link: "https://derbydefi.github.io/clothVerletSim/",
		},
		{
			key: "project3",
			title: "n-body simulation",
			description:
				"This Barnes-Hut N-body simulation models gravitational interactions between thousands of particles, simulating a wide range of celestial dynamics like planetary systems, rotating disks, and star clusters. The simulation uses a quadtree structure to optimize the computation of gravitational forces between particles. Instead of calculating every pairwise interaction, which would be computationally expensive, the Barnes-Hut algorithm groups distant particles together and treats them as a single mass, based on their center of mass. This approximation greatly improves the efficiency of the simulation, allowing it to handle large numbers of particles while maintaining reasonable performance.  <br>  The simulation employs Verlet integration to update the positions and velocities of the particles. This method uses both the current and previous positions to compute motion, which helps maintain stability in the particle dynamics, particularly during close encounters or high-speed interactions. As particles move and interact, they can collide and merge, leading to the formation of celestial bodies such as planets, suns, or black holes. When a particle accumulates enough mass, it may transition into a sun, which can eventually age and go supernova, ejecting new particles with explosive velocities. Some supernovae may even leave behind black holes, which continue to accrete surrounding particles. <br>   The simulation allows for various initial configurations, such as rotating disks, binary or trinary star systems, expanding spheres, and random distributions of particles. This versatility provides insight into different astrophysical phenomena and allows for the study of emergent behavior in gravitational systems. For visualization, the simulation offers features like particle trails that trace their paths and optional rendering of the quadtree, showing how space is subdivided for force calculations. The particles are color-coded based on their velocity, offering a dynamic visual representation of the system's energy and movement. Panning and zooming functionalities allow users to explore the system at different scales, from individual particle interactions to large-scale structures.",
			image: "assets/nbody.png",
			link: "https://derbydefi.github.io/n-body/",
		},
		{
			key: "project4",
			title: "mandelbrot fractal explorer",
			description:
				"This Mandelbrot fractal explorer is an interactive tool that allows users to explore the intricate details of the Mandelbrot set through zooming, panning, and various visual customization options. The fractal is rendered dynamically on a canvas element, with real-time calculations based on the chosen zoom level, pixel resolution, and iteration limits. The visualizations are enhanced with features such as color shifting, dithering, and orbit trapping, which can be toggled on or off for different artistic effects. The color scheme adapts based on the number of iterations and the distance of complex numbers from the Mandelbrot set's boundary, offering a vivid representation of the fractal's geometry. <br> Users can interact with the fractal by zooming in and out using their mouse wheel, which adjusts the zoom factor centered on the mouse's position. Panning is achieved by dragging the fractal, allowing exploration of different regions. An auto-zoom feature can be enabled for continuous zooming, creating an animated journey deeper into the fractal. Users can save their favorite zoom levels and coordinates, which are stored locally in the browser for easy access, and can revisit these saved locations with a single click. <br> The tool also provides various control options, such as adjusting the base iteration limit, zoom factor, and pixel skipping to balance performance and visual fidelity. Additional settings include the ability to enable orbit traps, which color the fractal based on the distance to the nearest trap, and color shifting, which creates a dynamic and ever-changing hue shift. The fractal explorer is highly customizable, making it both a mathematical exploration tool and a visual art generator.",
			image: "assets/mandel.png",
			link: "https://derbydefi.github.io/mandelbrot/",
		},

		// Add more projects here
	];

	// Function to dynamically create project navigation
	function createProjectNav() {
		const navList = document.querySelector("#projectNav ul");
		navList.innerHTML = ""; // Clear any existing content
		projects.forEach((project) => {
			const listItem = document.createElement("li");
			const link = document.createElement("a");
			link.href = "#";
			link.textContent = project.title;
			link.dataset.project = project.key;
			link.addEventListener("click", function (e) {
				e.preventDefault();
				loadProject(project.key);
			});
			listItem.appendChild(link);
			navList.appendChild(listItem);
		});
	}

	// Function to load the selected project details
	function loadProject(projectKey) {
		const project = projects.find((p) => p.key === projectKey);
		if (project) {
			document.getElementById("projectTitle").textContent = project.title;
			document.getElementById("projectImage").src = project.image;
			document.getElementById("projectImage").style.display = "block"; // Show the image
			document.getElementById("projectDescription").innerHTML = `

            <br><br>
<a href="${project.link}" target="_blank">link to project</a>
               <br><br>
${project.description} 

                
            `;
		}
	}

	// Initial setup: populate the project navigation
	createProjectNav();

	// Automatically display the first project on page load
	if (projects.length > 0) {
		loadProject(projects[0].key); // Load the first project
	}

	// Set default section to "home"
	function switchSection(sectionId) {
		document.querySelectorAll(".content-section").forEach((section) => {
			section.style.display = "none";
		});
		document.getElementById(sectionId).style.display = "block";
	}
	switchSection("home");

	// Navigation link click events for sections
	document.querySelectorAll("nav ul li a").forEach((link) => {
		link.addEventListener("click", function (event) {
			event.preventDefault();
			const sectionId = this.getAttribute("data-section");
			switchSection(sectionId);
		});
	});

	// Reload the page when the logo is clicked
	document.getElementById("logo").addEventListener("click", function (event) {
		event.preventDefault();
		location.reload();
	});
});
