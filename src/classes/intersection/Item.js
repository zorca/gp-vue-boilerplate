import IntersectionDirection from '@/classes/intersection/Direction';

export default class IntersectionItem {
  constructor (index, max, mirror) {
    this.offset = 0;
    this.component = () => import('@/components/molecules/ListItem');
    this.index = {
      initial: index,
      current: index
    };
    this.max = max;
    this.entry = {
      before: null,
      current: null
    };
    this.scrollDirection = new IntersectionDirection(mirror);
  }

  update (entry) {
    this.entry.before = this.entry.current;
    this.entry.current = entry;
  }

  getBaseIndex () {
    if (this.entry.before) {
      this.scrollDirection.update(this.entry);
      return calcBaseIndex(this.scrollDirection, this.max);
    }
    return 0;
  }

  arrangeOutsideOfViewport (baseItem) {
    if (this.scrollDirection.isValid()) {
      if (this.isValidToArrange()) {
        this.offset = baseItem.offset + this.scrollDirection;
      }
      return true;
    } else {
      return false;
    }
  }

  isValidToArrange () {
    return (
      this.scrollDirection.isDown() && isEntryAboveViewport(this.entry.current)
    ) || (
      this.scrollDirection.isUp() && isEntryBelowViewport(this.entry.current)
    );
  }
}

function calcBaseIndex (dir, size) {
  return (size + ((dir * -1) - 1) / 2) % size;
}

function isEntryAboveViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top < entry.intersectionRect.top;
}

function isEntryBelowViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top > entry.intersectionRect.top;
}

