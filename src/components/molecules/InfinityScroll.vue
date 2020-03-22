<template>
  <ul @scroll="onScroll">
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

const numEntries = 3;

export default {
  data () {
    return {
      intersectionObservable: null,
      subscription: null,
      entries: new Map(),
      list: Array.from(Array(numEntries).keys()).map((value) => {
        return {
          id: value,
          component: () => import('@/components/molecules/ListItem'),
          options: {
            numEntries,
            index: value,
            offset: 0,
            current: value
          }
        };
      })
    };
  },

  mounted () {
    this.intersectionObservable = new IntersectionObservable({
      root: this.$el,
      // rootMargin: '200% 0px',
      threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });
    this.subscription = this.intersectionObservable.subscribe(this.onUpdate);
    console.log(this);
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
      // if (entry.target.test && entry.boundingClientRect.y < entry.target.test.boundingClientRect.y) {
      //   console.log(true, entry.boundingClientRect.y, entry.target.test.boundingClientRect.y);
      // } else if (entry.target.test && entry.boundingClientRect.y > entry.target.test.boundingClientRect.y) {
      //   console.log(false, entry.boundingClientRect.y, entry.target.test.boundingClientRect.y);
      // }

      this.entries.set(entry.target.id, entry);
      const entries = Array.from(this.entries.values());
      const indexEntry = this.list[0];
      // console.log('index', indexEntry);
      if (this.entries.has(String(indexEntry.id))) {
        const marker = this.entries.get(String(indexEntry.id));
        arrangeEntriesOutsideOfViewport(entry, entries, this.list, marker);

        // if (marker === entry) {

        // }
      }

      entry.target.test = entry;
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
  return {
    above: getEntriesAboveViewport(entries),
    below: getEntriesBelowViewport(entries)
  };
}

function arrangeEntriesOutsideOfViewport (entry, entries, legend, marker) {
  const { above, below } = getEntriesOutsideOfViewport(entries);

  // const num = Math.floor(Math.abs((below.length - above.length) / 2));
  // above.unshift(...below.splice(below.length - 1 - num, below.length - 1));
  // console.log(num);

  console.log('above', above.map(entry => entry.target.id));
  // // // console.log(above);
  console.log('below', below.map(entry => entry.target.id));

  // const outsideOfViewport = below.concat(above);
  // console.log(outsideOfViewport.map(entry => entry.target.id));
  // while (below.length) {
  //   setAbove(below.pop(), legend, entries, marker);
  // }

  // while (below.length) {
  //   setAbove(below.pop(), legend, entries, marker);
  // }

  while (above.length) {
    setBelow(above.shift(), legend, entries, marker);
  }

  // while (outsideOfViewport.length) {
  //   // add entries below viewport
  //   setBelow(outsideOfViewport.shift(), legend, entries, marker);
  //   // add entries above viewport
  //   setAbove(outsideOfViewport.pop(), legend, entries, marker);
  // }
}

// function setAbove (entry, legend, entries, marker, value) {
//   if (entry) {
//     // console.log(entry.target, marker.target);
//     // if (entry.boundingClientRect.top < entry.intersectionRect.top) {
//     if (entry === marker && entry.target.test.boundingClientRect.top !== entry.boundingClientRect.top) {
//       legend[0].options.offset--;
//     } else {
//       // console.log((Number(entry.target.id) || 1) + 1);
//       console.log(entry.target.id, ((Number(entry.target.id)) + 1) % numEntries);
//       legend.find(item => item.id === Number(entry.target.id)).options.offset = legend[((Number(entry.target.id)) + 1) % numEntries].options.offset - 1;
//     }

//     // }
//   }
// }

function setBelow (entry, legend, entries, marker, value) {
  if (entry) {
    // console.log(entry.target, marker.target);
    // if (entry.boundingClientRect.top < entry.intersectionRect.top) {
    if (entry === marker && entry.target.test.boundingClientRect.top !== entry.boundingClientRect.top) {
      // console.log('double');
      legend[0].options.offset++;
    } else {
      legend.find(item => item.id === Number(entry.target.id)).options.offset = legend[(Number(entry.target.id) || 1) - 1].options.offset;
    }
    // }
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
