import { Observable } from 'rxjs';
import { flatMap, /* map, distinctUntilChanged, */ share } from 'rxjs/operators';

export default class IntersectionObservable {
  constructor (options) {
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
  }

  unobserve (el) {
    this.observer.unobserve(el);
  }

  reobserve (el) {
    this.unobserve(el);
    this.observe(el);
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
