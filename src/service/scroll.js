import { fromEvent } from 'rxjs';
import { map, bufferCount, share, startWith } from 'rxjs/operators';

const observer = new Map();
const abs = Math.abs;

export function subscribeToScroll (fn, el = global, bufferSize = 2) {
  if (!observer.has(el)) {
    observer.set(el, setupScrollObserver(el, bufferSize));
  }
  return observer.get(el).observer.subscribe(fn);
}

export function getScrollValues (el = global) {
  return observer.get(el).values;
}

function setupScrollObserver (el, bufferSize) {
  return {
    observer: createScrollObserver(el, bufferSize),
    values: createDefaultValues()
  };
}

function createScrollObserver (el, bufferSize) {
  return fromEvent(el, 'scroll').pipe(
    startWith(getScrollPos(el), getScrollPos(el)),
    map(() => getScrollPos(el)),
    bufferCount(bufferSize, 1),
    map(buffer => returnUpdatedScrollValues(buffer, observer.get(el).values)),
    share()
  );
}

function createDefaultValues () {
  return {
    direction: { x: 0, y: 0 },
    position: { x: 0, y: 0 }
  };
}

function getScrollPos (el = global) {
  const w = global;
  const e = global.document.documentElement;
  return {
    x: el.scrollLeft || w.pageXOffset || e.scrollLeft,
    y: el.scrollTop || w.pageYOffset || e.scrollTop
  };
}

function returnUpdatedScrollValues (buffer, values) {
  addDirectionToDefaultValues(calcDirection(buffer), values.direction);
  addPositionToDefaultValues(buffer[buffer.length - 1], values.position);
  return values;
}

function addDirectionToDefaultValues (direction, result) {
  result.x = direction.x / abs(direction.x) || 0;
  result.y = direction.y / abs(direction.y) || 0;
}

function addPositionToDefaultValues (position, result) {
  result.x = position.x;
  result.y = position.y;
}

function calcDirection (buffer) {
  return buffer.reduce((result, pos) => {
    return { x: pos.x - result.x, y: pos.y - result.y };
  });
}
