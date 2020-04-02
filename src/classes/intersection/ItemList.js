import { ipoint } from '@js-basics/vector';

export default class ItemList {
  constructor (max, total) {
    this.length = max;
    this.matrix = Array.from(Array(max.y).keys()).map((y) => {
      return Array.from(Array(max.x).keys()).map((x) => { return { index: ipoint(x, y), max }; });
    });
    this.total = total;
  }

  update (entry) {
    if (entry.isIntersecting) {
      const availableRange = ipoint(() => Math.floor((this.length - 1) / 2));
      for (let y = -availableRange.y; y <= availableRange.y; y++) {
        for (let x = -availableRange.x; x <= availableRange.x; x++) {
          updateItemByEntry(entry, ipoint(x, y), this.matrix, this.length, this.total);
        }
      }
    }
  }
}

function updateItemByEntry (entry, pos, matrix, length, total) {
  const indexOfItem = getIndexOfItem(entry, pos);
  const index = ipoint(() => Math.round((indexOfItem + length) % length));
  if (isInRange(indexOfItem, total)) {
    matrix[index.y][index.x].index = indexOfItem;
  }
}

function getIndexOfItem (entry, pos) {
  const { x, y } = JSON.parse(entry.target.dataset.index);
  return ipoint(() => ipoint(x, y) + pos);
}

function isInRange (indexOfItem, total) {
  return indexOfItem.x >= 0 && indexOfItem.x < total.x && indexOfItem.y >= 0 && indexOfItem.y < total.y;
}
