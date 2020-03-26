export default class Buffer {
  constructor (max) {
    this.count = 0;
    this.list = new Array(max);
  }

  add (...values) {
    values.forEach((value) => {
      this.list[this.count % this.list.length] = value;
      this.count++;
    });
  }

  before () {
    return this.list[(this.count + this.list.length - 2) % this.list.length];
  }

  current () {
    return this.list[(this.count + this.list.length - 1) % this.list.length];
  }

  destroy () {
    this.list = [];
  }
}
