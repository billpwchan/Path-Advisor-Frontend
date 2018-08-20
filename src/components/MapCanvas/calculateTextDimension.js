const ctx = document.createElement('canvas').getContext('2d');
const APPR_CHAR = 'M';
const height = Math.round(ctx.measureText(APPR_CHAR).width);

/**
 * @typedef Dimension
 * @property {number} width
 * @property {number} height
 */

/**
 * Approximate the rendered text width and height
 * @param {object} font
 * @return {Dimension} Text width and height
 */
function calculateTextDimension({ family, size, text }) {
  ctx.font = `${size} ${family}`;
  const width = Math.round(ctx.measureText(text).width);

  return { width, height };
}

export default calculateTextDimension;
