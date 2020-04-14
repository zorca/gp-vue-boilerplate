import { ipoint, point } from '@js-basics/vector';

export default class ItemList {
  constructor (max, total) {
    this.length = max;
    this.matrix = Array.from(Array(max.y).keys()).map((y) => {
      return Array.from(Array(max.x).keys()).map((x) => {
        return {
          index: ipoint(x, y),
          position: ipoint(x, y),
          offset: ipoint(0, 0),
          sizeDiff: point()
        };
      });
    });
    this.flat = this.matrix.flat();
    this.total = total;
    this.position = ipoint();
  }

  getItem (pos = ipoint()) {
    const { x, y } = ipoint(() => Math.round((pos + this.length) % this.length));
    return this.matrix[Number(y)][Number(x)];
  }

  setup () {
    this.matrix.reduce((offsetGlobal, y) => {
      return y.map((item, index) => {
        item.offset = offsetGlobal[Number(index)];
        return ipoint(() => item.sizeDiff + item.offset);
      });
    }, [
      ...Array(this.length.x)
    ].map((_, i) => ipoint()));
  }

  update (currentIndex, scrollDirection) {
    const availableRange = ipoint(() => Math.floor((this.length) / 2) * scrollDirection);
    const currentItem = this.getItem(currentIndex);

    let negSize = ipoint(() => currentItem.offset + currentItem.sizeDiff);
    let posSize = currentItem.offset;

    for (let y = 0; y <= availableRange.y; y++) {
      for (let x = 0; x <= availableRange.x; x++) {
        const offset = ipoint(x, y);
        negSize = this.updateItem(currentItem, offset, negSize, -1);
        posSize = this.updateItem(currentItem, offset, posSize, 1);
      }
    }
  }

  updateItem (item, offset, size, direction) {
    offset = ipoint(() => offset * direction);
    const currentIndex = ipoint(() => item.index + offset);
    const currentItem = this.getItem(currentIndex);
    const extendedSize = currentItem.sizeDiff;

    if (isInRange(currentIndex, this.total) && !currentIndex.equals(currentItem.index)) {
      currentItem.index = currentIndex;
      // when to move an element the value should be -/+ items length
      const xtraOffset = ipoint(() => Math.floor((item.position + offset) / this.length) * this.length);
      if (direction < 0) {
        currentItem.offset = ipoint(() => size + xtraOffset + extendedSize * direction);
      } else if (direction > 0) {
        currentItem.offset = ipoint(() => size + xtraOffset);
      }
    }
    size = ipoint(() => size + extendedSize * direction);
    return size;
  }

  // updateItem (index) {
  //   const item = this.getItem(index);
  //   if (isInRange(index, this.total)) {
  //     item.index = index;
  //     item.offset = this.getItemOffset(index);
  //   }
  // }
}

function isInRange (indexOfItem, total) {
  return indexOfItem.x >= 0 && indexOfItem.x < total.x && indexOfItem.y >= 0 && indexOfItem.y < total.y;
}
