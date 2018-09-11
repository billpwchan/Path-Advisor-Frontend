const ctx = document.createElement('canvas').getContext('2d');
const APPR_CHAR = 'M';
const height = {};

/**
 * @param {string} fontStyle
 * @return {number}
 */
function calculateApproximateTextHeight(fontStyle) {
  if (!height[fontStyle]) {
    height[fontStyle] = Math.round(ctx.measureText(APPR_CHAR).width);
  }

  return height[fontStyle];
}

/**
 * @typedef Dimension
 * @property {number} width
 * @property {number} height
 */

/**
 * Approximate the rendered text width and height
 * @param {string} family
 * @param {string} size
 * @param {string} text
 * @return {Dimension} Text width and height
 */
function calculateTextDimension(family, size, text) {
  ctx.font = `${size} ${family}`;
  const width = Math.round(ctx.measureText(text).width);
  return { width, height: calculateApproximateTextHeight(ctx.font) };
}

export default calculateTextDimension;
