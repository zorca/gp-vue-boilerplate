import { fromEvent, timer } from 'rxjs';
import { debounce, map, startWith, share } from 'rxjs/operators';
import { Point } from '@js-basics/vector';

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
  return observer.pipe(startWith(getSize())).subscribe(value => fn(value));
}

export function getSize () {
  return new Point(getX(), getY());
}

function getX () {
  return w.innerWidth || e.clientWidth || g.clientWidth;
}

function getY () {
  return w.innerHeight || e.clientHeight || g.clientHeight;
}
