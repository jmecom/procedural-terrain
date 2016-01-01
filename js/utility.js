/* randRange
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}