import { ipoint } from '@js-basics/vector';
import ValueBuffer from '@/classes/Buffer';
export default class Entry {
  constructor () {
    this.count = 0;
    this.buffer = new ValueBuffer(2);
  }

  update (entry) {
    this.buffer.add({
      time: entry.time,
      rootBounds: ipoint(entry.rootBounds.width, entry.rootBounds.height),
      boundingClientRect: ipoint(entry.boundingClientRect.x, entry.boundingClientRect.y),
      intersectionRect: ipoint(entry.intersectionRect.x, entry.intersectionRect.y),
      intersectionRatio: entry.intersectionRatio,
      isIntersecting: entry.isIntersecting,
      isVisible: entry.isVisible,
      target: entry.target
    });
  }

  before () {
    return this.buffer.before();
  }

  current () {
    return this.buffer.current();
  }

  isBeforeViewport () {
    const e = this.current();
    return e.intersectionRatio === 0 && (e.boundingClientRect.x < e.intersectionRect.x || e.boundingClientRect.y < e.intersectionRect.y);
  }

  isAfterViewport () {
    const e = this.current();
    return e.intersectionRatio === 0 && (e.boundingClientRect.x > e.intersectionRect.x || e.boundingClientRect.y > e.intersectionRect.y);
  }

  identifyDirection () {
    const posDiff = ipoint(() => this.current().boundingClientRect - this.before().boundingClientRect);
    // if (!hasOffsetUpdate(current, before) && posDiff !== 0) {
    return ipoint(() => (-posDiff / +Math.abs(posDiff)) || 0);
  }

  destroy () {
    this.buffer.destroy();
  }
}

// function hasOffsetUpdate (current, before) {
//   return Math.abs(before.boundingClientRect.y - current.boundingClientRect.y) > current.rootBounds.y;
// }
