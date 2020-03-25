export default class ItemList {
  constructor (list) {
    this.list = list;
  }

  get (index) {
    return this.list[Number(index)];
  }

  getItemByEntry (entry) {
    return this.list.find(item => item.index.initial === Number(entry.target.id));
  }

  getBaseItem (item) {
    const index = calcBaseIndex(item.scrollDirection.current(), this.list.length);
    return this.list[Number(index)];
  }

  destroy () {
    this.list = this.list.reduce((result, item) => {
      item.destroy();
      return result;
    }, []);
  }
}

function calcBaseIndex (dir, size) {
  return (size + ((dir * -1) - 1) / 2) % size;
}
