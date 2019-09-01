import { fromEvent } from 'rxjs';
import { Victor } from '@js-basics/vector';

const observer = new Map();

export function subscribeToScroll (fn, el = global) {
  if (!observer.has(el)) {
    observer.set(el, fromEvent(el, 'scroll'));
  }
  return observer.get(el).subscribe(fn);
}

export function getScrollPos (el = global) {
  const w = global;
  const e = global.document.documentElement;
  return new Victor(el.scrollLeft || w.pageXOffset || e.scrollLeft, el.scrollTop || w.pageYOffset || e.scrollTop);
}
