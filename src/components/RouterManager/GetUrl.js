export default function getUrl({ floor, x, y, scale }) {
  return `/floor/${floor}/at/${x},${y},${scale}`;
}
