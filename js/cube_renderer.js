/*
 * 123456789012345678901234567890123456789012345678901234567890123456789012345678901234567
 */

/* Constants */
var width  = window.innerWidth,
    height = window.innerHeight;

/* Shared variables for rendering */
var scene, camera, renderer, controls;

/* init
 * Initializes the scene, camera, trackball controls, and WebGL renderer.
 */ 
function init() {
	scene    = new THREE.Scene();
	camera   = new THREE.PerspectiveCamera(75,  width/height, 0.1, 1000);
	camera.position.z = 5;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	document.body.appendChild(renderer.domElement);

	controls = new THREE.TrackballControls(camera);  
	controls.rotateSpeed = 1.5;
	controls.zoomSpeed = 0.25;
	controls.addEventListener('change', render);
}

/* gen_mountains 
 * Generates mountains using the Diamond-Square algorithm,
 * and adds them to the scene.
 */
function gen_mountains() {
	// Start with a plane
	var w  = 32,
	    h  = 32,
			geometry = new THREE.PlaneGeometry(3, 3, w, h);

	// Initialize the four corners with a pre-seeded value
	geometry.vertices[0].z = 1;
	geometry.vertices[w].z = 1;
	geometry.vertices[w*(h+1)].z = 1;
	geometry.vertices[w*(h+1) + w].z = 1;

	// Apply the Diamond-Square algorithm to generate mountainous terrain
  var r = 1, // Roughness constant
 		  s = w; 

  while (s > 0) {
  	// Diamond step
  	for (var i = 0; i < w; i++) {
  		for (var j = 0; j < h - 1; j++) {
  			var top_left = 

  		}
  	}

  	// Square step

  }


	// Apply a simple wireframe material and add mountains to the scene
	var material  = new THREE.MeshBasicMaterial({wireframe: true}),
	    mountains = new THREE.Mesh(geometry, material);

	scene.add(mountains);

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
gen_mountains();
update();
