import { Victor } from '@js-basics/vector';

export function getElementSize (el) {
  const bounds = el.getBoundingClientRect();
  return new Victor(bounds.width, bounds.height);
}
