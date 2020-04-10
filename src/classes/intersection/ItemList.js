import { ipoint, point } from '@js-basics/vector';

export default class ItemList {
  constructor (max, total) {
    this.length = max;
    this.matrix = Array.from(Array(max.y).keys()).map((y) => {
      return Array.from(Array(max.x).keys()).map((x) => {
        return {
          index: ipoint(x, y),
          position: ipoint(x, y),
          offset: ipoint(-1, 0),
          size: point(),
          sizeDiff: point()
        };
      });
    });
    this.total = total;
    this.position = ipoint();
  }

  getItem (pos = this.position) {
    const { x, y } = ipoint(() => Math.round((pos + this.length) % this.length));
    return this.matrix[Number(y)][Number(x)];
  }

  getItemOffset (pos) {
    return ipoint(() => Math.floor(pos / this.length) * this.length);
  }

  setup () {
    this.matrix.reduce((offsetGlobal, y) => {
      const offsetLocal = y.reduce((offsetLocal, item, index) => {
        item.offset = offsetGlobal[Number(index)];
        offsetLocal[Number(index)] = item.sizeDiff;
        return offsetLocal;
      }, new Array(this.length.x).fill(ipoint()));

      return offsetLocal.map((size, index) => {
        return ipoint(() => size + offsetGlobal[Number(index)]);
      });
    }, new Array(this.length.x).fill(ipoint()));
  }

  update (currentIndex) {
    const availableRange = ipoint(() => Math.floor((this.length) / 2));
    for (let x = -availableRange.x; x <= availableRange.x; x++) {
      const currentItem = this.getItem(ipoint(() => currentIndex + ipoint(x, 0)));
      let negSize = ipoint(() => currentItem.offset + currentItem.sizeDiff);
      let posSize = currentItem.offset;

      for (let y = 0; y <= availableRange.y; y++) {
        // // hello
        const rangeIndexNeg = ipoint(() => currentIndex - ipoint(x, y));
        const oNeg = this.getItemOffset(rangeIndexNeg);

        // if (isInRange(rangeIndexNeg, this.total)) {
        const rangeItemNeg = this.getItem(rangeIndexNeg);
        negSize = ipoint(() => negSize - rangeItemNeg.sizeDiff);
        rangeItemNeg.offset = ipoint(() => negSize + oNeg);
        // // }

        const rangeIndexPos = ipoint(() => currentIndex + ipoint(x, y));
        const oPos = this.getItemOffset(rangeIndexPos);
        // if (isInRange(rangeIndexPos, this.total)) {
        const rangeItemPos = this.getItem(rangeIndexPos);
        console.log(oPos.y);
        rangeItemPos.offset = ipoint(() => posSize + oPos);
        // rangeItemPos.index = ipoint(() => rangeItemPos + rangeIndexPos + rangeItemPos.index);
        posSize = ipoint(() => posSize + rangeItemPos.sizeDiff);
        // }
      }
    }
    this.position = currentIndex;
    return this;
  }

  updateItem (index) {
    const item = this.getItem(index);
    if (isInRange(index, this.total)) {
      item.index = index;
      item.offset = this.getItemOffset(index);
    }
  }
}

function isInRange (indexOfItem, total) {
  return indexOfItem.x >= 0 && indexOfItem.x < total.x && indexOfItem.y >= 0 && indexOfItem.y < total.y;
}
