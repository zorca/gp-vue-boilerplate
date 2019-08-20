import { fromEvent, timer } from 'rxjs';
import { debounce, map, startWith, share } from 'rxjs/operators';

const w = global || {};
const d = w.document || {};
const e = d.documentElement || {};
let g = {};
if (d.getElementsByTagName) {
  g = d.getElementsByTagName('body')[0];
}

const observer = fromEvent(global, 'resize').pipe(
  debounce(() => timer(350)),
  map(() => getSize()),
  share()
);

export function subscribeToViewport (fn) {
  observer.pipe(startWith(getSize())).subscribe(value => fn(value));
}

function getSize () {
  return { x: getX(), y: getY() };
}

function getX () {
  return w.innerWidth || e.clientWidth || g.clientWidth;
}

function getY () {
  return w.innerHeight || e.clientHeight || g.clientHeight;
}
