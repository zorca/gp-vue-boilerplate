import { fromEvent, timer } from 'rxjs';
import { map, debounce } from 'rxjs/operators';

const w = global || {};
const d = w.document || {};
const e = d.documentElement;
let g = null;
if (e) {
  g = d.getElementsByTagName('body')[0];
}

export let x = 0;
export let y = 0;
export function subscribeToViewport(fn) {
  observer.subscribe(value => fn(value));
}
export function getViewport() {
  return updateViewportSize();
}

const observer = fromEvent(global, 'resize').pipe(
  debounce(() => timer(350)),
  map(() => {
    return updateViewportSize();
  })
);

function updateViewportSize() {
  x = w.innerWidth || e.clientWidth || g.clientWidth;
  y = w.innerHeight || e.clientHeight || g.clientHeight;
  return { x: x, y: y };
}
