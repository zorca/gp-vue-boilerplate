import { Observable } from 'rxjs';
import { flatMap, /* map, distinctUntilChanged, */ share } from 'rxjs/operators';

export default class IntersectionObservable {
  constructor (options) {
    this.elements = new Set();
    this.observable = new Observable((observer) => {
      this.observer = createIntersectionObserver(observer, options);
      return () => { this.observer.disconnect(); };
    })
      .pipe(
        flatMap(entries => entries),
        // map((entry) => { console.log('AJA'); return entry.isIntersecting; }),
        // distinctUntilChanged(),
        share()
      );
  }

  subscribe (...args) {
    return this.observable.subscribe(...args);
  }

  observe (el) {
    this.observer.observe(el);
    this.elements.add(el);
  }

  unobserve (el) {
    this.observer.unobserve(el);
    this.elements.delete(el);
  }

  unobserveAll () {
    Array.from(this.elements).forEach((item) => {
      this.unobserve(item);
    });
  }

  reobserve (el) {
    this.unobserve(el);
    this.observe(el);
  }

  reobserveAll () {
    Array.from(this.elements).forEach((item) => {
      this.reobserve(item);
    });
  }

  destroy () {
    this.observer.disconnect();
  }
};

function createIntersectionObserver (observer, options = null) {
  return new global.IntersectionObserver((entries) => {
    observer.next(entries);
  }, options);
}
