import IntersectionItemDirection from '@/classes/intersection/item/Direction';
import IntersectionItemEntry from '@/classes/intersection/item/Entry';

export default class IntersectionItem {
  constructor (index, max, mirror) {
    this.offset = 0;
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

    if (this.entry.before()) {
      this.scrollDirection.update(this.entry);
    }
  }

  arrangeOutsideOfViewport (baseItem) {
    if (this.scrollDirection.isValid()) {
      if (this.isValidToArrange()) {
        this.offset = baseItem.offset + this.scrollDirection.current();
        this.index.current = this.offset * this.max + this.index.initial;
      }
      return false;
    }
    return true;
  }

  isValidToArrange () {
    return (
      this.scrollDirection.isDown() && this.entry.isAboveViewport()
    ) || (
      this.scrollDirection.isUp() && this.entry.isBelowViewport()
    );
  }
}

