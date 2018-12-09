<template>
  <ul>
    <!-- <iframe
      ref="iframe"
    sandbox="allow-scripts"/>-->
    <item
      v-for="(item, key) in itemsInit"
      :key="key"
      :num="key"
      :master="item.master"
      :range="range"
      :offset="offset"
      :step="segment"
      :items="items"
      class="tile"
    >
      <template slot-scope="slotProps">
        <preview
          :config="slotProps.config"
          @open="onOpen"
        />
      </template>
    </item>
  </ul>
</template>

<script>
import Vue from 'vue';
import Preview from '@/components/atoms/Preview';
import Item from '@/components/molecules/infinityScrollList/Item';
import { getViewport } from '../../service/viewport';
import { getMovieSourceUrls, getMoviesBy, getTotalCountOf } from '@/service/kinox';

export default {
  components: {
    Preview,
    Item
  },

  data () {
    return {
      itemsInit: [],
      items: [],
      range: {
        x: 0,
        y: 0
      },
      offset: {
        x: 0,
        y: 2
      },
      segment: {
        x: 0,
        y: 0
      },
      count: 0
    };
  },

  mounted () {
    this.$on('resize', this.onResize);
    this.$on('next', this.onNext);

    this.setup();
  },

  methods: {
    setup () {
      getTotalCountOf().then((count) => {
        this.iterator = getMoviesBy({ length: 60 });
        this.items = Array.apply(null, { length: count }).map(() => { return {}; });
        let item = { master: true };
        this.itemsInit = [item];
      });
    },

    onResize (tileSize) {
      // console.log(this.segment);
      this.range = this.getRange(getElementsInViewport(tileSize));
      this.createElements(this.range.x * this.range.y);
      this.$el.style.height = (Math.ceil(this.items.length / this.range.x) * tileSize.y) + 'px';
      // global.scrollTo(0, 3000);
    },

    onNext (segment) {
      this.segment = segment;
      // console.log(this.count * 60, this.range.x * this.range.y * (step.y + 2));
      if (this.count * 60 < this.range.x * this.range.y * (segment.y + 2)) {
        return this.getNext().then((done) => {
          if (!done) {
            this.onNext(segment);
          }
        });
      } else {
        return Promise.resolve([]);
      }
    },

    onOpen (value) {
      getMovieSourceUrls(value)
        .then((urls) => {
          console.log(urls);
          this.$refs.iframe.src = urls[0][0];

        });
    },

    createElements (num) {
      this.itemsInit = [{ master: true }, ...Array.apply(null, { length: num - 1 }).map(() => { return { step: { x: this.segment.x, y: this.segment.y } }; })];
      this.onNext(this.segment);
    },

    getNext () {
      return this.iterator.next({ length: 60 }).then(({ value = [], done }) => {
        value.forEach((item, i) => {
          Vue.set(this.items, this.count * 60 + i, item);
        });
        this.count++;
        return done;
      });
    },

    getRange (maxElementsInViewport) {
      return {
        x: maxElementsInViewport.x + this.offset.x * 2,
        y: maxElementsInViewport.y + this.offset.y * 2
      };
    }
  }
};

function getElementsInViewport (size) {
  let viewport = getViewport();
  return {
    x: Math.floor(viewport.x / size.x),
    y: Math.ceil(viewport.y / size.y)
  };
}
</script>

<style lang="postcss">
body {
  overflow-y: scroll;
}

ul {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
