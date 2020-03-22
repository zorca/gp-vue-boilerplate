<template>
  <ul>
    <component
      :is="item.component"
      v-for="item in list"
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
      entries: new Map(),
      scrolBefore: -1,
      scrollDirection: {
        current: null,
        before: null
      },
      list: Array.from(Array(numEntries).keys()).map((value) => {
        return {
          id: value,
          component: () => import('@/components/molecules/ListItem'),
          options: {
            numEntries,
            index: value,
            offset: 0,
            current: value,
            repaint: false
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
      const item = this.list.find(item => item.id === Number(entry.target.id));
      item.entry.current = entry;

      if (item.entry.before) {
        this.scrollDirection.current = getScrollDirection(item.entry);
        arrangeEntriesOutsideOfViewport(item, this.list, this.scrollDirection);
        this.scrollDirection.before = this.scrollDirection.current;
      }
      item.entry.before = entry;
    }
  }
};

function getScrollDirection (entry) {
  const posDiff = entry.current.boundingClientRect.top - entry.before.boundingClientRect.top;
  if (!hasMovedPosition(entry) && posDiff > 0) {
    return -1;
  } else if (!hasMovedPosition(entry) && posDiff < 0) {
    return 1;
  } else {
    return 0;
  }
}

function hasMovedPosition (entry) {
  return Math.abs(entry.before.boundingClientRect.y - entry.current.boundingClientRect.y) > entry.current.rootBounds.height;
}

function arrangeEntriesOutsideOfViewport (item, legend, scrollDirection) {
  if (scrollDirection.current !== scrollDirection.before) {
    readjustEntries(legend);
  } else if (scrollDirection.current === 1 && isEntryAboveViewport(item.entry.current)) {
    placeOutsideOfViewport(item, legend[legend.length - 1], scrollDirection.current);
  } else if (scrollDirection.current === -1 && isEntryBelowViewport(item.entry.current)) {
    placeOutsideOfViewport(item, legend[0], scrollDirection.current);
  }
}

function readjustEntries (entries) {
  // TODO: correct order to reobserve
  entries.forEach((item) => {
    item.entry.current.target.__vue__.observable.reobserve(item.entry.current.target);
  });
}

function isEntryAboveViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top < entry.intersectionRect.top;
}

function isEntryBelowViewport (entry) {
  return entry.intersectionRatio === 0 && entry.boundingClientRect.top > entry.intersectionRect.top;
}

function placeOutsideOfViewport (item, baseItem, scrollDirection) {
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
