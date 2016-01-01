/* Constants */
var width  = window.innerWidth,
    height = window.innerHeight;

/* Shared variables for rendering */
var scene, camera, renderer, controls, terrainGenerator;

/* init
 * Initializes all variables needed for rendering. 
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

  terrainGenerator = new TerrainGenerator(17, 17);
}

/* genTerrain
 * Generates terrain using an algorithm provided by TerrainGenerator,
 * and adds the terrain to the scene.
 */
function genTerrain() {
  scene.add(terrainGenerator.diamondSquare());
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

/* Begin rendering */ 
init();
genTerrain();
update();
