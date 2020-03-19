<template>
  <ul @scroll="onScroll">
    <component
      :is="item.component"
      v-for="item in list.all"
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

export default {
  data () {
    return {
      intersectionObservable: null,
      subscription: null,
      intersectScreen: new Map(),
      leftScreen: new Map(),
      entries: new Map(),
      list: {
        aboveScreen: [],
        belowScreen: [],
        all: Array.from(Array(20).keys()).map((value) => {
          return {
            id: value,
            component: () => import('@/components/molecules/ListItem'),
            options: {
              offset: 0,
              current: value
            }
          };
        })
      }
    };
  },

  mounted () {
    this.intersectionObservable = new IntersectionObservable({
      root: this.$el,
      threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });
    this.subscription = this.intersectionObservable.subscribe(this.onUpdate);
  },

  destroyed () {
    this.subscription.unsubscribe();
    this.intersectionObservable.destroy();
  },

  methods: {
    onScroll () {
      // console.log('SCROLL');
    },

    onUpdate (entry) {
      this.entries.set(entry.target.id, entry);

      const entries = Array.from(this.entries.values());
      const indexEntry = this.list.all[0];
      if (this.entries.has(String(indexEntry.id))) {
        const marker = this.entries.get(String(indexEntry.id));
        arrangeEntriesOutsideOfViewport(entry, entries, this.list.all, marker);
        marker.target.before = entry;
      }
    }
  }
};

function getEntriesAboveViewport (entries) {
  return entries.filter((entry) => {
    return entry.intersectionRatio === 0 && entry.boundingClientRect.top < entry.intersectionRect.top;
  });
}

function getEntriesBelowViewport (entries) {
  return entries.filter((entry) => {
    return entry.intersectionRatio === 0 && entry.boundingClientRect.top > entry.intersectionRect.top;
  });
}

// function getEntriesInsideViewport (entries) {
//   return entries.filter((entry) => {
//     return entry.intersectionRatio === 1;
//   });
// }

function getEntriesOutsideOfViewport (entries) {
  const above = getEntriesAboveViewport(entries);
  const below = getEntriesBelowViewport(entries);
  console.log('above', above.map(entry => entry.target.id));
  console.log('below', below.map(entry => entry.target.id));
  return below.concat(above);
  // return above.concat(below.reverse());
}

function arrangeEntriesOutsideOfViewport (entry, entries, legend, marker) {
  const outsideOfViewport = getEntriesOutsideOfViewport(entries);
  console.log(outsideOfViewport.map(entry => entry.target.id));
  while (outsideOfViewport.length) {
    // add entries below viewport
    setBelow(outsideOfViewport.shift(), legend, entries, marker);
    // add entries above viewport
    setAbove(outsideOfViewport.pop(), legend, entries, marker);
  }
}

function setAbove (entry, legend, entries, marker, value) {
  if (entry) {
    if (entry.boundingClientRect.top > entry.intersectionRect.top) {
      // console.log('JAPP', entry.target.id);
      legend.find(item => item.id === Number(entry.target.id)).options.offset = legend[0].options.offset - 1;
    }
  }
}

function setBelow (entry, legend, entries, marker, value) {
  if (entry) {
    if (entry.boundingClientRect.top < entry.intersectionRect.top) {
      // if (entry === marker) {
      //   console.log('double');
      //   legend[0].options.offset++;
      // } else {
      // console.log('JAPP', entry.target.id);
      legend.find(item => item.id === Number(entry.target.id)).options.offset = legend[0].options.offset;
      // }
    }
  }
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
