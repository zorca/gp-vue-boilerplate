<template>
  <ul
    :class="htmlClasses()"
  >
    <list-item
      v-for="(item, index) in items.flat()"
      :key="'list-item-' + index"
      :index="item.index"
      :max="item.max"
      :observable="observable"
    />
    <list-item v-if="toggle && !activate">
      <button @click="enable">
        more
      </button>
    </list-item>
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
import ListItem from '@/components/molecules/ListItem';

export default {
  components: {
    ListItem
  },

  props: {
    mirror: {
      type: IPoint,
      default () {
        return ipoint(-1, -1);
      }
    },
    max: {
      type: IPoint,
      default () {
        return ipoint(1, 21);
      }
    },
    rootMargin: {
      type: String,
      default () {
        return '-50% -50%';
      }
    },
    toggle: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },

  data () {
    return {
      observable: null,
      subscription: null,
      items: new IntersectionItemList(this.max, ipoint(1, Infinity)),
      activate: false
    };
  },

  mounted () {
    if (!this.toggle) {
      this.enable();
    }
  },

  destroyed () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.observable) {
      this.observable.destroy();
    }
  },

  methods: {
    htmlClasses () {
      return {
        'scroll-mirror': this.mirror.x < 0 || this.mirror.y < 0,
        'scroll-direction-horizontal': this.max.x > 1,
        'scroll-direction-vertical': this.max.y > 1
      };
    },

    enable () {
      this.observable = new IntersectionObservable({
        root: this.$el,
        rootMargin: this.rootMargin
      });
      this.subscription = this.observable.subscribe(entry => this.items.update(entry));
      this.activate = true;
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
