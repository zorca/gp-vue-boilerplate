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
    }
  },
  data () {
    return {
      observable: null,
      subscription: null,
      items: new IntersectionItemList(Array.from(Array(this.maxItems).keys()).map((value) => {
        return new IntersectionItem(value, this.maxItems, this.scrollBottomUp);
      }))
    };
  },

  mounted () {
    this.observable = new IntersectionObservable({
      root: this.$el,
      rootMargin: '150% 0px',
      threshold: Array.from(Array(100).keys()).map((value) => { return value / 100; })
    });
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

      if (!item.arrangeOutsideOfViewport(this.items.getBaseItem(item))) {
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
