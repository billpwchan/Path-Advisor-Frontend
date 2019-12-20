function length(v) {
  return Math.sqrt(v[0] ** 2 + v[1] ** 2);
}

function normalize(v) {
  const magnitude = length(v);
  return [v[0] / magnitude, v[1] / magnitude];
}

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function inverse(v) {
  return [v[1], -v[0]];
}

function dot(k, v) {
  return [k * v[0], k * v[1]];
}

function crossProduct(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

export { normalize, add, sub, inverse, dot, crossProduct, length };
