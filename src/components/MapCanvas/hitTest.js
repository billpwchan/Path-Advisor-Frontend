import { crossProduct, sub, normalize, inverse, dot, add } from './vector';

/**
 * Test if a point inside a rect or not
 * @param {number} x - point coordinate x
 * @param {number} y - point coordinate y
 * @param {number} hitX - object coordinate x
 * @param {number} hitY - object coordinate y
 * @param {number} hitWidth - object width
 * @param {number} hitHeight - object height
 * @return {boolean}
 */
function rect(x, y, hitX, hitY, hitWidth, hitHeight) {
  const xInRange = x >= hitX && x <= hitX + hitWidth;
  const yInRange = y >= hitY && y <= hitY + hitHeight;

  return xInRange && yInRange;
}

/**
 * Test if a point inside a convex polygon or not
 * @param {number} x
 * @param {number} y
 * @param {array} coordinates
 * @return {boolean}
 */
function polygon(x, y, coordinates) {
  if (polygon.length < 3) {
    throw new Error('Polygon must have at least 3 vertices');
  }

  let sign = 0;

  return coordinates.every((vertex, i) => {
    const nextVertex = coordinates[(i + 1) % coordinates.length];
    const v1 = sub(vertex, [x, y]);
    const v2 = sub(nextVertex, [x, y]);
    const edge = sub(v1, v2);
    const currentSign = Math.sign(crossProduct(edge, v1));

    if (!sign) {
      sign = currentSign;
    }
    // point on the edge considered as in the polygon
    return sign === currentSign || currentSign === 0;
  });
}

/**
 * Test if a point inside a set of lines or not
 * @param {number} x
 * @param {number} y
 * @param {number} errorMargin Error margin
 * @param {array} coordinates
 * @return {number} -1 if no hit, otherwise returns a index where the line (coordinates[index], coordinates[index + 1]) is the section of the line it hits
 */

function lineSection(x, y, errorMargin, coordinates) {
  if (coordinates.length < 2) {
    throw new Error('A line must have at least two coordinates');
  }

  let index = -1;

  coordinates.some((point, i) => {
    if (i === coordinates.length - 1) {
      return false;
    }

    const nextPoint = coordinates[i + 1];
    const directionVector = normalize(inverse(sub(nextPoint, point)));
    const marginAreaPolygon = [
      add(point, dot(errorMargin, directionVector)),
      add(point, dot(-errorMargin, directionVector)),
      add(nextPoint, dot(-errorMargin, directionVector)),
      add(nextPoint, dot(errorMargin, directionVector)),
    ];

    const hit = polygon(x, y, marginAreaPolygon);

    if (hit) {
      index = i;
    }

    return hit;
  });

  return index;
}

export { rect, polygon, lineSection };
