/* Constants */
var width  = window.innerWidth,
    height = window.innerHeight;

/* Shared variables for rendering */
var scene, camera, renderer, controls;

/* init
 * Initializes the scene, camera, trackball controls, and WebGL renderer.
 */ 
function init() {
	scene  = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

	camera.position.x = 0.7;
	camera.position.y = -4;
	camera.position.z = 3;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	document.body.appendChild(renderer.domElement);

	controls = new THREE.TrackballControls(camera);  
	controls.rotateSpeed = 1.5;
	controls.zoomSpeed = 0.25;
	controls.addEventListener('change', render);
}

/* rand_range
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function rand_range(min, max) {
  return Math.random() * (max - min) + min;
}

/* gen_terrain
 * Generates terrain using the Diamond-Square algorithm,
 * and adds them to the scene.
 */
function gen_terrain() {
	// Start with a plane
	var w = 17,
	    h = 17,
			geometry = new THREE.PlaneGeometry(3, 3, w-1, h-1);

	// Z-values to assign to geometry vertices, initialized to 0s
	var z_values = [];
	for (var i = 0; i < w; i++) {
		var row = [];
		for (var j = 0; j < h; j++) {
			row.push(0);
		}
		z_values.push(row);
	}

	// Initialize the four corners with a pre-seeded value
	z_values[0][0]     = 0.5;
	z_values[w-1][0]   = 0.5;
	z_values[0][h-1]   = 0.5;
	z_values[w-1][h-1] = 0.5;

	// Diamond-Square algorithm
	var step_size = w-1,
			lower     = -0.1,
			upper     =  0.1;

	while (step_size > 1) {
		var half_step = Math.floor(step_size / 2);

		// Diamond step
		for (var y = 0; y < h - 1; y += step_size) {
			for (var x = 0; x < w - 1; x += step_size) {
				var top_left  = z_values[x][y],
						top_right = z_values[x + step_size][y],
						bot_left  = z_values[x][y + step_size],
						bot_right = z_values[x + step_size][y + step_size];

				var avg  = (top_left + top_right + bot_left + bot_right) / 4,
						rand = rand_range(lower, upper);
				z_values[x + half_step][y + half_step] = avg + rand;
			}
		}

		// Square step
		var even = true;
		for (var y = 0; y < h; y += half_step) {
			var x_start = even ? 0 : half_step;
			for (var x = x_start; x < w; x += half_step) {
				var left  = x - half_step < 0  ? 0 : z_values[x - half_step][y],
						right = x + half_step >= w ? 0 : z_values[x + half_step][y],
						up    = z_values[x][y + half_step] || 0,
						down  = z_values[x][y - half_step] || 0;

				var avg  = (left + right + up + down) / 4,
						rand = rand_range(lower, upper);
				z_values[x][y] = avg + rand;
			}
			even = !even;
		}

		step_size /= 2;	
		lower += 0.005;
		upper -= 0.005;
	}

	// Give the calculated Z-values to the geometry
	var idx = 0;
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			geometry.vertices[idx].z = z_values[i][j] || 0;
			idx++;
		}
	}

	// Apply a simple wireframe material and add terrain to the scene
	var material  = new THREE.MeshBasicMaterial({wireframe: true}),
    	terrain = new THREE.Mesh(geometry, material);

	scene.add(terrain);
}

/* update
 * Updates the scene in response to user input. 
 */
function update() {
	requestAnimationFrame(update);
	controls.update();
	render();
}

/* render
 * Renders the scene using the camera.
 */
function render() {
	renderer.render(scene, camera);
}

init();
gen_terrain();
update();
