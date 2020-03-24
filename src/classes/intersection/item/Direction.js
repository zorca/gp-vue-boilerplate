import ValueBuffer from '@/classes/Buffer';

export default class Direction {
  constructor (mirror = false) {
    this.mirror = mirror;
    this.buffer = new ValueBuffer(2);
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
    return this.current() === this.before() && this.current() !== 0;
  }

  isDown () {
    return this.current() === mirrorDirection(1, this.mirror);
  }

  isUp () {
    return this.current() === mirrorDirection(-1, this.mirror);
  }
}

function mirrorDirection (dir, mirror) {
  if (mirror) {
    return dir * -1;
  }
  return dir;
}
