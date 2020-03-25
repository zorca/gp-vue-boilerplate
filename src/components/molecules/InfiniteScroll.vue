<template>
  <ul :class="{'scroll-bottom-up': scrollBottomUp}">
    <component
      :is="item.component"
      v-for="item in items.list"
      :id="item.index.initial"
      :key="'list-item-' + item.index.initial"
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
import IntersectionObservable from '@/classes/intersection/Observable';
import IntersectionItemList from '@/classes/intersection/ItemList';
import IntersectionItem from '@/classes/intersection/Item';

export default {
  props: {
    scrollBottomUp: {
      type: Boolean,
      default () {
        return true;
      }
    },
    maxItems: {
      type: Number,
      default () {
        return 20;
      }
    },
    rootMargin: {
      type: String,
      default () {
        return '150% 0%';
      }
    }
  },
  data () {
    return {
      observable: null,
      subscription: null,
      items: [],
      total: -1
    };
  },

  mounted () {
    this.observable = new IntersectionObservable({
      root: this.$el,
      rootMargin: this.rootMargin,
      threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });

    this.items = new IntersectionItemList(Array.from(Array(this.maxItems).keys()).map((value) => {
      return new IntersectionItem(value, this.maxItems, this.scrollBottomUp);
    }));

    this.subscription = this.observable.subscribe(this.onUpdate);
  },

  destroyed () {
    this.subscription.unsubscribe();
    this.observable.destroy();
  },

  methods: {
    onUpdate (entry) {
      const item = this.items.getItemByEntry(entry);
      item.update(entry);

      if (!item.arrangeOutsideOfViewport(this.items.getBaseItem(item), this.total)) {
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
