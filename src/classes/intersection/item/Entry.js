import { ipoint } from '@js-basics/vector';
import ValueBuffer from '@/classes/Buffer';
export default class Entry {
  constructor () {
    this.count = 0;
    this.buffer = new ValueBuffer(2);
  }

  update (entry) {
    this.buffer.add(convertEntry(entry));
  }

  before () {
    return this.buffer.before() || this.current();
  }

  current () {
    return this.buffer.current();
  }

  isValid () {
    const viewportOffset = this.getViewportOffset();
    return this.current().intersectionRatio === 0 && (viewportOffset.x !== 0 || viewportOffset.y !== 0);
  }

  getViewportOffset () {
    const e = this.current();
    return ipoint(() => ((e.boundingClientRect - e.intersectionRect) / Math.abs(e.boundingClientRect - e.intersectionRect)) || 0);
  }

  identifyDirection () {
    const posDiff = ipoint(() => Math.round(this.current().boundingClientRect - this.before().boundingClientRect));
    return ipoint(() => (-posDiff / +Math.abs(posDiff)) || 0);
  }

  destroy () {
    this.buffer.destroy();
  }
}

function convertEntry (entry) {
  return {
    time: entry.time,
    rootBounds: ipoint(entry.rootBounds.width, entry.rootBounds.height),
    boundingClientRect: ipoint(entry.boundingClientRect.x, entry.boundingClientRect.y),
    intersectionRect: ipoint(entry.intersectionRect.x, entry.intersectionRect.y),
    intersectionRatio: entry.intersectionRatio,
    isIntersecting: entry.isIntersecting,
    isVisible: entry.isVisible,
    target: entry.target
  };
}
