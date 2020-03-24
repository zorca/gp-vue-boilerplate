import ValueBuffer from '@/classes/Buffer';

export default class Entry {
  constructor () {
    this.count = 0;
    this.buffer = new ValueBuffer(2);
  }

  update (entry) {
    this.buffer.add(entry);
  }

  before () {
    return this.buffer.before();
  }

  current () {
    return this.buffer.current();
  }

  isAboveViewport () {
    const e = this.current();
    return e.intersectionRatio === 0 && e.boundingClientRect.top < e.intersectionRect.top;
  }

  isBelowViewport () {
    const e = this.current();
    return e.intersectionRatio === 0 && e.boundingClientRect.top > e.intersectionRect.top;
  }

  identifyDirection () {
    const current = this.current();
    const before = this.before();
    const posDiff = getDiff(current, before);
    if (!hasOffsetUpdate(current, before) && posDiff !== 0) {
      return -posDiff / Math.abs(posDiff);
    }
    return 0;
  }
}

function getDiff (current, before) {
  return current.boundingClientRect.top - before.boundingClientRect.top;
}

function hasOffsetUpdate (current, before) {
  return Math.abs(before.boundingClientRect.y - current.boundingClientRect.y) > current.rootBounds.height;
}
