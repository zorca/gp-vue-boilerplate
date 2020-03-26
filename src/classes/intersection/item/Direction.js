import { ipoint } from '@js-basics/vector';
import ValueBuffer from '@/classes/Buffer';

export default class Direction {
  constructor (mirror = false) {
    this.mirror = mirror;
    this.buffer = new ValueBuffer(2);
    this.buffer.add(ipoint(), ipoint());
  }

  update (entry) {
    this.buffer.add(mirrorDirection(entry.identifyDirection(), this.mirror));
  }

  before () {
    return this.buffer.before();
  }

  current () {
    return this.buffer.current();
  }

  isValid () {
    return (
      this.current() &&
      this.before()
    ) && ((
      this.current().y === this.before().y &&
      this.current().y !== 0
    ) || (
      this.current().x === this.before().x &&
      this.current().x !== 0
    ));
  }

  isPositive () {
    const expectedDirection = mirrorDirection(ipoint(1, 1), this.mirror);
    return this.current().x === expectedDirection.x || this.current().y === expectedDirection.y;
  }

  isNegative () {
    const expectedDirection = mirrorDirection(ipoint(-1, -1), this.mirror);
    return this.current().x === expectedDirection.x || this.current().y === expectedDirection.y;
  }

  destroy () {
    this.buffer.destroy();
  }
}

function mirrorDirection (dir, mirror) {
  return ipoint(() => dir * mirror);
}
