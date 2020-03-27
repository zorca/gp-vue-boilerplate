<template>
  <ul
    :class="htmlClasses()"
  >
    <component
      :is="item.component"
      v-for="(item) in items.flat()"
      :key="'list-item-' + item.index.initial.x + '-' + item.index.initial.y"
      :data-x="item.index.initial.x"
      :data-y="item.index.initial.y"
      :offset="item.offset"
      :max="item.max"
      :observable="observable"
      :value="item.index.current"
    />
  </ul>
</template>

<story
  name="InfiniteScroll"
  group="Molecules">
  <infinite-scroll></infinite-scroll>
</story>

<script>
import { ipoint, IPoint } from '@js-basics/vector';
import IntersectionObservable from '@/classes/intersection/Observable';
import IntersectionItemList from '@/classes/intersection/ItemList';
import IntersectionItem from '@/classes/intersection/Item';

export default {
  props: {
    scrollMirror: {
      type: IPoint,
      default () {
        return ipoint(-1, -1);
      }
    },
    maxItems: {
      type: IPoint,
      default () {
        return ipoint(1, 20);
      }
    },
    rootMargin: {
      type: String,
      default () {
        return '200% 1600%';
      }
    }
  },

  data () {
    return {
      observable: null,
      subscription: null,
      items: [],
      total: ipoint(1, Infinity)
    };
  },

  mounted () {
    this.items = new IntersectionItemList(
      Array.from(Array(this.maxItems.x).keys()).map((x) => {
        return Array.from(Array(this.maxItems.y).keys()).map((y) => {
          return new IntersectionItem(ipoint(x, y), this.maxItems, this.scrollMirror);
        });
      })
    );

    this.observable = new IntersectionObservable({
      root: this.$el,
      rootMargin: this.rootMargin
      // threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });

    this.subscription = this.observable.subscribe(this.onUpdate);
  },

  destroyed () {
    this.subscription.unsubscribe();
    this.observable.destroy();
  },

  methods: {
    htmlClasses () {
      return {
        'scroll-mirror': this.scrollMirror.x < 0 || this.scrollMirror.y < 0,
        'scroll-direction-horizontal': this.maxItems.x > 1,
        'scroll-direction-vertical': this.maxItems.y > 1
      };
    },

    onUpdate (entry) {
      const item = this.items.getItemByEntry(entry);
      item.update(entry);

      if (item.arrangeOutsideOfViewport(this.items.getBaseItem(item), this.total)) {
        console.log('AJA');
        this.readjustItems();
      }
    },

    readjustItems () {
      this.observable.reobserveAll();
    }
  }
};
</script>

<style lang="postcss" scoped>
ul {
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: auto;

  &.scroll-direction-vertical {
    flex-wrap: wrap;
    height: 100vh;

    &.scroll-mirror {
      transform: rotateZ(180deg);
      direction: rtl;
    }
  }

  &.scroll-direction-horizontal {
    &.scroll-mirror {
      direction: rtl;
    }
  }

}
</style>
