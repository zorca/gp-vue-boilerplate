export default class Direction {
  constructor (mirror = false) {
    this.mirror = mirror;
    this.current = null;
    this.before = null;
  }

  update (entry) {
    this.before = this.current;
    this.current = mirrorDirection(validateDirection(entry), this.mirror);
  }

  isValid () {
    return this.current === this.before && this.current !== 0;
  }

  isDown () {
    return this.current === mirrorDirection(1, this.mirror);
  }

  isUp () {
    return this.current === mirrorDirection(-1, this.mirror);
  }

  valueOf () {
    return this.current;
  }
}

function validateDirection (entry) {
  const posDiff = getDiff(entry);
  if (!hasOffsetUpdate(entry) && posDiff !== 0) {
    return -posDiff / Math.abs(posDiff);
  }
  return 0;
}

function getDiff (entry) {
  return entry.current.boundingClientRect.top - entry.before.boundingClientRect.top;
}

function hasOffsetUpdate (entry) {
  return Math.abs(entry.before.boundingClientRect.y - entry.current.boundingClientRect.y) > entry.current.rootBounds.height;
}

function mirrorDirection (dir, mirror) {
  if (mirror) {
    return dir * -1;
  }
  return dir;
}
