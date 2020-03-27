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
    const current = this.current();
    const before = this.before();

    return (
      current &&
      before
    ) && ((
      current.y === before.y &&
      current.y !== 0
    ) || (
      current.x === before.x &&
      current.x !== 0
    ));
  }

  destroy () {
    this.buffer.destroy();
  }
}

function mirrorDirection (dir, mirror) {
  return ipoint(() => dir * mirror);
}
