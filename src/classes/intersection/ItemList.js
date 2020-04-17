import { ipoint, point } from '@js-basics/vector';

export default class ItemList {
  constructor (max, total, scrollDirection) {
    const scrollAxis = scrollDirection.x > scrollDirection.y ? 'x' : 'y';
    const staticAxis = scrollDirection.x < scrollDirection.y ? 'x' : 'y';
    max = ipoint({ [scrollAxis]: max.x, [staticAxis]: max.y });

    this.length = max;
    this.matrix = Array.from(Array(max[String(scrollAxis)]).keys()).map((slot) => {
      return Array.from(Array(max[String(staticAxis)]).keys()).map((item) => {
        return {
          index: ipoint({ [scrollAxis]: slot, [staticAxis]: item }),
          position: ipoint({ [scrollAxis]: slot, [staticAxis]: item }),
          offset: ipoint(0, 0),
          sizeDiff: point(),
          enlargement: Promise.resolve(ipoint())
        };
      });
    });
    this.scrollAxis = scrollAxis;
    this.staticAxis = staticAxis;
    this.total = total;
    this.position = ipoint();
  }

  getItem (pos = ipoint()) {
    const index = ipoint(() => Math.round((pos + this.length) % this.length));
    return this.matrix[index[this.scrollAxis]][index[this.staticAxis]];
  }

  setup () {
    this.matrix.reduce((offsetGlobal, slot) => {
      return slot.map((item, index) => {
        item.offset = offsetGlobal[Number(index)] || ipoint();
        return ipoint(() => item.sizeDiff + item.offset);
      });
    }, []);
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

  updateItem (item, matrixOffset, size, direction) {
    matrixOffset = ipoint(() => matrixOffset * direction);
    const currentIndex = ipoint(() => item.index + matrixOffset);
    const currentItem = this.getItem(currentIndex);
    const sizeDiff = currentItem.sizeDiff;

    if (!currentIndex.equals(currentItem.index) && isInRange(currentIndex, this.total)) {
      currentItem.index = currentIndex;
      const currentOffset = ipoint(() => size + Math.floor((item.position + matrixOffset) / this.length) * this.length);
      if (direction < 0) {
        currentItem.offset = ipoint(() => currentOffset + sizeDiff * direction);
      } else if (direction > 0) {
        currentItem.offset = currentOffset;
      }
    }
    size = ipoint(() => size + sizeDiff * direction);
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
