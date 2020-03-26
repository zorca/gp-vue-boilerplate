import { ipoint } from '@js-basics/vector';
import IntersectionItemDirection from '@/classes/intersection/item/Direction';
import IntersectionItemEntry from '@/classes/intersection/item/Entry';

export default class IntersectionItem {
  constructor (index, max, mirror) {
    this.offset = ipoint();
    this.index = {
      initial: index,
      current: ipoint(() => index)
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
    if (this.entry.before()) {
      this.scrollDirection.update(this.entry);
    }
  }

  arrangeOutsideOfViewport (baseItem, total) {
    if (this.scrollDirection.isValid() && baseItem) {
      const offset = ipoint(() => baseItem.offset + this.scrollDirection.current());
      const index = ipoint(() => offset * this.max + this.index.initial);

      if (this.isValidToArrange() /* && isInRange(index, total) */) {
        this.offset = offset;
        this.index.current = index;
      }
      return false;
    }
    return true;
  }

  isValidToArrange () {
    return (
      this.scrollDirection.isPositive() && this.entry.isBeforeViewport()
    ) || (
      this.scrollDirection.isNegative() && this.entry.isAfterViewport()
    );
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

