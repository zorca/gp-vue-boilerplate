import { ipoint } from '@js-basics/vector';
import Item from '@/classes/intersection/Item';
export default class ItemList {
  constructor (max, total, direction) {
    this.direction = direction;
    this.axis = getAxis(this.direction);
    this.max = ipoint({ [this.axis.scroll]: max.x, [this.axis.static]: max.y });
    this.matrix = getMatrix(this.max, this.axis);
    this.total = total;
  }

  setup () {
    this.matrix.reduce((offsetGlobal, slot) => {
      return slot.map((item, index) => {
        item.offset = offsetGlobal[Number(index)] || ipoint();
        return ipoint(() => item.sizeDiff + item.offset);
      });
    }, []);
  }

  update (index) {
    const centeredItem = this.getItem(index);
    let accumulatedSlotOffsets = [
      ipoint(() => centeredItem.offset + centeredItem.sizeDiff),
      centeredItem.offset
    ];

    const availableRange = ipoint(() => Math.floor((this.max) / 2) * this.direction);
    for (let item = 0; item <= availableRange[this.axis.scroll]; item++) {
      const bidirectionalOffset = ipoint({ [this.axis.scroll]: item, [this.axis.static]: 0 });
      accumulatedSlotOffsets = this.updateBidirectional(centeredItem, bidirectionalOffset, accumulatedSlotOffsets);
    }
  }

  updateBidirectional (centeredItem, bidirectionalOffset, accumulatedSlotOffsets) {
    return accumulatedSlotOffsets.map((accumulatedSlotOffset, i) => {
      const direction = i * 2 - 1;
      const offset = ipoint(() => bidirectionalOffset * direction);
      const position = ipoint(() => centeredItem.position + offset);
      const index = ipoint(() => centeredItem.index + offset);
      return this.updateItem(index, position, accumulatedSlotOffset, direction);
    });
  }

  updateItem (index, position, accumulatedSlotOffset, direction) {
    const item = this.getItem(index);
    const size = ipoint(() => item.sizeDiff * direction);

    if (!index.equals(item.index) && isInRange(index, this.total)) {
      const xtraOffset = ipoint(() => Math.floor(position / this.max) * this.max);
      item.offset = calcItemOffset(direction, accumulatedSlotOffset, xtraOffset, size);
      item.index = index;
    }
    return ipoint(() => accumulatedSlotOffset + size);
  }

  getItem (pos = ipoint()) {
    const index = ipoint(() => Math.round((pos + this.max) % this.max));
    return this.matrix[index[this.axis.scroll]][index[this.axis.static]];
  }
}

function calcItemOffset (direction, accumulatedSlotOffset, xtraOffset, size) {
  direction = (direction * -1 + 1) / 2;
  return ipoint(() => accumulatedSlotOffset + xtraOffset + size * direction);
}

const axis = [
  'x', 'y'
];

function getAxis (direction) {
  return {
    scroll: axis[Number(direction.x < direction.y)],
    static: axis[Number(direction.x > direction.y)]
  };
}

function getMatrix (max, axis) {
  return Array.from(Array(max[String(axis.scroll)]).keys()).map((slot) => {
    return Array.from(Array(max[String(axis.static)]).keys()).map((item) => {
      return new Item(ipoint({ [axis.scroll]: slot, [axis.static]: item }));
    });
  });
}

function isInRange (indexOfItem, total) {
  return indexOfItem.x >= 0 && indexOfItem.x < total.x && indexOfItem.y >= 0 && indexOfItem.y < total.y;
}
