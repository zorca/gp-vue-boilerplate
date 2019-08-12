import { Victor } from '@js-basics/vector';

export function getNormalizedPointer (e, boundingClientRect) {
  const { x, y, width, height } = boundingClientRect;
  const elemPos = new Victor(x, y);
  const elemHalfSize = new Victor(() => new Victor(width, height) / 2);
  const touchPos = new Victor(e.x, e.y);
  return new Victor(() => (touchPos - elemPos - elemHalfSize) / elemHalfSize);
}
