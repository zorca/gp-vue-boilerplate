<template>
  <ul>
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
        this.scrollDirection.current = getScrollDirection(item);
        arrangeEntriesOutsideOfViewport(item, this.items, this.scrollDirection);
        this.scrollDirection.before = this.scrollDirection.current;
      }
      item.entry.before = entry;
    }
  }
};

function getScrollDirection (item) {
  const posDiff = item.entry.current.boundingClientRect.top - item.entry.before.boundingClientRect.top;
  if (!hasOffsetUpdate(item) && posDiff > 0) {
    return -1;
  } else if (!hasOffsetUpdate(item) && posDiff < 0) {
    return 1;
  } else {
    return 0;
  }
}

function arrangeEntriesOutsideOfViewport (item, legend, scrollDirection) {
  if (scrollDirection.current !== scrollDirection.before) {
    readjustItems(legend);
  } else if (isScrollDown(scrollDirection) && isEntryAboveViewport(item.entry.current)) {
    placeItemOutsideOfViewport(item, legend[legend.length - 1], scrollDirection.current);
  } else if (isScrollUp(scrollDirection) && isEntryBelowViewport(item.entry.current)) {
    placeItemOutsideOfViewport(item, legend[0], scrollDirection.current);
  }
}

function hasOffsetUpdate (item) {
  return Math.abs(item.entry.before.boundingClientRect.y - item.entry.current.boundingClientRect.y) > item.entry.current.rootBounds.height;
}

function readjustItems (items) {
  // TODO: correct order to reobserve
  items.forEach((item) => {
    item.entry.current.target.__vue__.observable.reobserve(item.entry.current.target);
  });
}

function isScrollUp (scrollDirection) {
  return scrollDirection.current === -1;
}

function isScrollDown (scrollDirection) {
  return scrollDirection.current === 1;
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
}
</style>
