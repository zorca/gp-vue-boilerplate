import { ipoint } from '@js-basics/vector';

export default class ItemList {
  constructor (matrix) {
    this.matrix = matrix;
    this.length = ipoint(this.matrix.length, this.matrix[0].length);
  }

  flat () {
    return this.matrix.flat();
  }

  get (index) {
    return this.matrix[index.x][index.y];
  }

  getItemByEntry (entry) {
    const dataset = entry.target.dataset;
    return this.get(dataset);
  }

  getBaseItem (item) {
    const index = calcBaseIndex(item.scrollDirection.current(), this.length);
    return this.get(index);
  }

  destroy () {
    // this.list = this.list.reduce((result, item) => {
    //   item.destroy();
    //   return result;
    // }, []);
  }
}

function calcBaseIndex (dir, size) {
  return ipoint(() => Math.floor((size + ((dir * -1) - 1) / 2) % size));
}
