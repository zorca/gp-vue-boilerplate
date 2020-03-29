import { Observable } from 'rxjs';
import { flatMap, distinctUntilChanged, share } from 'rxjs/operators';

export default class IntersectionObservable {
  constructor (options) {
    this.elements = new Set();
    this.observable = new Observable((observer) => {
      this.observer = createIntersectionObserver(observer, options);
      return () => { this.observer.disconnect(); };
    })
      .pipe(
        flatMap(entries => entries),
        distinctUntilChanged(),
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

  destroy () {
    this.observer.disconnect();
  }
};

function createIntersectionObserver (observer, options = null) {
  return new global.IntersectionObserver((entries) => {
    observer.next(entries);
  }, options);
}
