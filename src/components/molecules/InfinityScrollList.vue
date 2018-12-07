<template>
  <ul>
    <!-- <iframe
      ref="iframe"
    sandbox="allow-scripts"/>-->
    <item
      v-for="(item, key) in itemsInit"
      :key="key"
      :position="key"
      :master="item.master"
      :range="range"
      :offset="offset"
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
import Preview from '@/components/atoms/Preview';
import Item from '@/components/molecules/infinityScrollList/Item';
import { getViewport } from '../../service/viewport';
import { getMovieSourceUrls, getMoviesBy } from '@/service/kinox';
let count = 20;
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
        x: 5,
        y: 5
      }
    };
  },

  mounted () {
    this.$on('load', this.onLoad);
    this.$on('resize', this.onResize);
    this.$on('next', this.onNext);
    this.getMoviesByGenre();
  },

  methods: {
    onLoad (tileSize) {
      let maxElementsOnAxis = this.getMaxElementsInViewport(tileSize);
      this.range = this.getRangeOfElementsByAxis(maxElementsOnAxis);
      // console.log(tileSize, getViewport());
      // let numOffsetTiles = getNumOffsetTilesByViewportWidth(tileSize, maxElementsOnAxis);

      let maxElements = (maxElementsOnAxis.x * maxElementsOnAxis.y) + (maxElementsOnAxis.x * this.offset.y * 2);
      this.createElements(maxElements);
    },

    onResize (size) {
      let maxElementsOnAxis = this.getMaxElementsInViewport(size);
      this.range = this.getRangeOfElementsByAxis(maxElementsOnAxis);

      let maxElements = (maxElementsOnAxis.x * maxElementsOnAxis.y) + (maxElementsOnAxis.x * this.offset.y * 2);
      // this.createElements(maxElements);
      this.onNext({ x: 0, y: 0 }).then(() => {
        // this.items[0].master = true;
        this.itemsInit = this.items.slice(0, maxElements);
      });
    },

    onNext (step) {
      let offset = (this.range.x * this.range.y * 3) + (this.range.x * this.range.y * step.y);
      if (offset > this.items.length) {
        count++;
        console.log('REQUESTED LENGTH', count);
        return this.iterator.next({ length: count }).then(({ value = [], done }) => {
          console.log('RESPONSE LENGTH', value.length);
          this.items = this.items.concat(value);
          if (!done) {
            this.onNext(step);
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
      this.itemsInit = [{ master: true }, ...new Array(num - 1).fill({})];
      this.$off('load', this.onLoad);
      console.log(this.itemsInit);
      this.onNext({ x: 0, y: 0 }).then(() => {
        // this.items[0].master = true;
        // this.itemsInit = this.items.slice(0, num);
      });
    },

    getMoviesByGenre () {
      this.iterator = getMoviesBy({ length: count });
      let item = { master: true };
      this.itemsInit = [item];
    },

    getRangeOfElementsByAxis (maxElementsInViewport) {
      return {
        x: maxElementsInViewport.x,
        y: maxElementsInViewport.y + this.offset.y * 2
      };
    },

    getMaxElementsInViewport (size) {
      let viewport = getViewport();
      return {
        x: Math.floor(viewport.x / size.x),
        y: Math.ceil(viewport.y / size.y)
      };
    }
  }
};

// function getNumOffsetTilesByViewportWidth (tileSize, maxElements) {
//   let viewport = getViewport();
//   return Math.ceil(viewport.x / tileSize.y) * maxElements.x;
// }

</script>

<style lang="postcss">
ul {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
