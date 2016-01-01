/* TerrainGenerator implements various algorithms that create 
 * heightmaps, and returns the result as THREE.js mesh.
 */
function TerrainGenerator(width, height) {
  this.width  = width;
  this.height = height;

  /* diamondSquare 
   * Returns a mesh using a PlaneGeomtry modified by the Diamond-Square algorithm
   * Note: for this to work, width and height must be expressable as 2^n + 1 
   *       (e.g. 5x5, 17x17, 33x33)
   */ 
  TerrainGenerator.prototype.diamondSquare = function() {
    var geometry = new THREE.PlaneGeometry(3, 3, this.width-1, this.height-1),
        zValues = [];

    // Z-values will be assigned to geometry vertices 
    for (var i = 0; i < this.width; i++) {
      var row = [];
      for (var j = 0; j < this.height; j++) {
        row.push(0);
      }
      zValues.push(row);
    }

    // Initialize the four corners with a pre-seeded value
    zValues[0][0] = 0.5;
    zValues[this.width-1][0] = 0.5;
    zValues[0][this.height-1] = 0.5;
    zValues[this.width-1][this.height-1] = 0.5;

    // Diamond-Square algorithm
    var stepSize = this.width-1,
        lower = -0.1,
        upper =  0.1;

    while (stepSize > 1) {
      var halfStep = Math.floor(stepSize / 2);

      // Diamond step
      for (var y = 0; y < this.height - 1; y += stepSize) {
        for (var x = 0; x < this.width - 1; x += stepSize) {
          var topLeft  = zValues[x][y],
              topRight = zValues[x + stepSize][y],
              botLeft  = zValues[x][y + stepSize],
              botRight = zValues[x + stepSize][y + stepSize];

          var avg = (topLeft + topRight + botLeft + botRight) / 4,
              rand = randRange(lower, upper);
          zValues[x + halfStep][y + halfStep] = avg + rand;
        }
      }

      // Square step
      var even = true;
      for (var y = 0; y < this.height; y += halfStep) {
        var xStart = even ? 0 : halfStep;
        for (var x = xStart; x < this.width; x += halfStep) {
          var left  = x - halfStep < 0  ? 0 : zValues[x - halfStep][y],
              right = x + halfStep >= this.width ? 0 : zValues[x + halfStep][y],
              up    = zValues[x][y + halfStep] || 0,
              down  = zValues[x][y - halfStep] || 0;

          var avg = (left + right + up + down) / 4,
              rand = randRange(lower, upper);
          zValues[x][y] = avg + rand;
        }
        even = !even;
      }

      stepSize /= 2; 
      lower += 0.005;
      upper -= 0.005;
    }

    // Give the calculated Z-values to the geometry
    var idx = 0;
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        geometry.vertices[idx].z = zValues[i][j] || 0;
        idx++;
      }
    }

    // Apply a simple wireframe material 
    var material = new THREE.MeshBasicMaterial({wireframe: true}),
        terrain  = new THREE.Mesh(geometry, material);

    return terrain; 
  };
};