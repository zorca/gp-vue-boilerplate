import { ipoint } from '@js-basics/vector';
import IntersectionItemDirection from '@/classes/intersection/item/Direction';
import IntersectionItemEntry from '@/classes/intersection/item/Entry';

export default class IntersectionItem {
  constructor (index, max, mirror) {
    this.offset = ipoint();
    this.index = {
      initial: index,
      current: index
    };
    this.max = max;
    this.entry = new IntersectionItemEntry();
    this.scrollDirection = new IntersectionItemDirection(mirror);
  }

  component () {
    return import('@/components/molecules/ListItem');
  }

  update (entry) {
    this.entry.update(entry);
    this.scrollDirection.update(this.entry);
  }

  arrangeOutsideOfViewport (baseItem, total) {
    if (this.scrollDirection.isValid() && this.entry.isValid() && baseItem) {
      console.log(this.entry.current().target.id);
      this.offset = ipoint(() => baseItem.offset + this.scrollDirection.current());
      this.index.current = ipoint(() => this.offset * this.max + this.index.initial);
      return true;
    }
    return false;
  }

  destroy () {
    this.scrollDirection.destroy();
    this.entry.destroy();
  }
}

// function isInRange (index, total) {
//   const result = ipoint(() => total - index);
//   return result.x > 0 && result.y > 0;
// }

