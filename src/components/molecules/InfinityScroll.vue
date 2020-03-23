<template>
  <ul :class="{'scroll-bottom-up': scrollBottomUp}">
    <component
      :is="item.component"
      v-for="item in items"
      :id="item.id"
      :key="'list-item-' + item.id"
      :options="item.options"
      :observable="intersectionObservable"
    />
  </ul>
</template>

<story
  name="InfinitiyScroll"
  group="Molecules">
  <infinity-scroll></infinity-scroll>
</story>

<script>
import IntersectionObservable from '@/classes/IntersectionObservable';

const numEntries = 20;

export default {
  props: {
    scrollBottomUp: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  data () {
    return {
      intersectionObservable: null,
      subscription: null,
      scrollDirection: {
        current: null,
        before: null
      },
      items: Array.from(Array(numEntries).keys()).map((value) => {
        return {
          id: value,
          component: () => import('@/components/molecules/ListItem'),
          options: {
            numEntries,
            offset: 0
          },
          entry: {
            current: null,
            before: null
          }
        };
      })
    };
  },

  mounted () {
    this.intersectionObservable = new IntersectionObservable({
      root: this.$el,
      rootMargin: '100% 0px',
      threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });
    this.subscription = this.intersectionObservable.subscribe(this.onUpdate);
  },

  destroyed () {
    this.subscription.unsubscribe();
    this.intersectionObservable.destroy();
  },

  methods: {
    onUpdate (entry) {
      const item = this.items.find(item => item.id === Number(entry.target.id));
      item.entry.current = entry;

      if (item.entry.before) {
        this.scrollDirection.current = getScrollDirection(item, this.scrollBottomUp);
        // console.log(this.scrollDirection.current);
        arrangeEntriesOutsideOfViewport(item, this.items, this.scrollDirection, this.intersectionObservable, this.scrollBottomUp);
        this.scrollDirection.before = this.scrollDirection.current;
      }
      item.entry.before = entry;
    }
  }
};

function getScrollDirection (item, scrollBottomUp) {
  const posDiff = item.entry.current.boundingClientRect.top - item.entry.before.boundingClientRect.top;
  const dir = validateScrollDirection(item, posDiff);
  return mirrorDirection(dir, scrollBottomUp);
}

function validateScrollDirection (item, posDiff) {
  if (!hasOffsetUpdate(item) && posDiff !== 0) {
    return -posDiff / Math.abs(posDiff);
  }
  return 0;
}

function mirrorDirection (dir, scrollBottomUp) {
  if (scrollBottomUp) {
    return dir * -1;
  }
  return dir;
}

function arrangeEntriesOutsideOfViewport (item, legend, scrollDirection, intersectionObservable, scrollBottomUp) {
  if (scrollDirection.current !== scrollDirection.before || scrollDirection.current === 0) {
    readjustItems(intersectionObservable);
  } else if (isScrollDown(scrollDirection, scrollBottomUp) && isEntryAboveViewport(item.entry.current)) {
    // console.log('OHO', scrollDirection.current, item.entry.current.target.id, calcBaseIndex(scrollDirection.current, legend.length));
    placeItemOutsideOfViewport(item, legend[calcBaseIndex(scrollDirection.current, legend.length)], scrollDirection.current);
  } else if (isScrollUp(scrollDirection, scrollBottomUp) && isEntryBelowViewport(item.entry.current)) {
    // console.log('AHA', scrollDirection.current, item.entry.current.target.id, calcBaseIndex(scrollDirection.current, legend.length));
    placeItemOutsideOfViewport(item, legend[calcBaseIndex(scrollDirection.current, legend.length)], scrollDirection.current);
  }
}

function calcBaseIndex (dir, size) {
  return (size + ((dir * -1) - 1) / 2) % size;
}

function hasOffsetUpdate (item) {
  return Math.abs(item.entry.before.boundingClientRect.y - item.entry.current.boundingClientRect.y) > item.entry.current.rootBounds.height;
}

function readjustItems (intersectionObservable) {
  // TODO: correct order to reobserve
  intersectionObservable.reobserveAll();
}

function isScrollUp (scrollDirection, scrollBottomUp) {
  return scrollDirection.current === mirrorDirection(-1, scrollBottomUp);
}

function isScrollDown (scrollDirection, scrollBottomUp) {
  return scrollDirection.current === mirrorDirection(1, scrollBottomUp);
}

function isEntryAboveViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top < entry.intersectionRect.top;
}

function isEntryBelowViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top > entry.intersectionRect.top;
}

function placeItemOutsideOfViewport (item, baseItem, scrollDirection) {
  item.options.offset = baseItem.options.offset + scrollDirection;
}
</script>

<style lang="postcss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: scroll;

  &.scroll-bottom-up {
    transform: rotateZ(180deg);
    direction: rtl;
  }
}
</style>
