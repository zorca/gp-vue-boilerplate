<template>
  <ul
    :class="{
      'scroll-mirror': mirror,
      'scroll-horizontal': scroll.horizontal,
      'scroll-vertical': scroll.vertical
    }"
  >
    <li
      v-for="(listY, indexY) in items.matrix"
      :key="'list-item-' + indexY"
    >
      <list-item
        v-for="(item, indexX) in listY"
        :key="'list-item-' + indexY + '-' + indexX"
        :index="item.index"
        :max="item.max"
        :observable="observable"
      >
        <template v-slot:default="props">
          <slot name="item" :index="props.index" />
        </template>
      </list-item>
      <list-item v-if="toggle && !activate && scroll.horizontal">
        <slot name="toggle-button" :click="enable" />
      </list-item>
    </li>
    <li v-if="toggle && !activate && scroll.vertical">
      <list-item v-for="value in Array(gridX).keys()" :key="'more-'+ value">
        <slot name="toggle-button" :click="enable" />
      </list-item>
    </li>
  </ul>
</template>

<story
  name="default"
  group="Molecules/InfiniteScroll/vertical"
  knobs="{
    toggle: { default: boolean('toggle', false) },
    mirror: { default: boolean('mirror direction', false) },
    gridX: { default: number('items on x-axis', 1) },
    gridY: { default: number('items on y-axis', 10) }
  }">
  <infinite-scroll :mirror="mirror" :toggle="toggle" :gridX="gridX" :gridY="gridY">
    <template v-slot:item="props">
      <div>
        hello {{ props.index.x }} {{ props.index.y }}
      </div>
    </template>
    <template v-slot:toggle-button="props">
      <button @click="props.click">more</button>
    </template>
  </infinite-scroll>
</story>

<story
  name="default"
  group="Molecules/InfiniteScroll/horizontal"
  knobs="{
    toggle: { default: boolean('toggle', false) },
    mirror: { default: boolean('mirror direction', false) },
    gridX: { default: number('items on x-axis', 10) },
    gridY: { default: number('items on y-axis', 1) }
  }">
  <infinite-scroll :mirror="mirror" :toggle="toggle" :gridX="gridX" :gridY="gridY"></infinite-scroll>
</story>

<script>
import { ipoint } from '@js-basics/vector';
import IntersectionObservable from '@/classes/intersection/Observable';
import IntersectionItemList from '@/classes/intersection/ItemList';
import ListItem from '@/components/molecules/ListItem';

export default {
  components: {
    ListItem
  },

  props: {
    mirror: {
      type: Boolean,
      default () {
        return false;
      }
    },
    gridX: {
      type: Number,
      default () {
        return 10;
      }
    },
    gridY: {
      type: Number,
      default () {
        return 10;
      }
    },
    rootGlobal: {
      type: Boolean,
      default () {
        return false;
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
      items: new IntersectionItemList(ipoint(this.gridX, this.gridY), this.getTotal()),
      activate: false,
      scroll: {
        horizontal: false,
        vertical: false
      }
    };
  },

  mounted () {
    this.scroll.horizontal = this.$el.scrollWidth > this.$el.clientWidth;
    this.scroll.vertical = this.$el.scrollHeight > this.$el.clientHeight;

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
    enable () {
      this.observable = new IntersectionObservable({
        root: this.getRoot(),
        rootMargin: this.rootMargin
      });
      this.subscription = this.observable.subscribe(entry => this.items.update(entry));
      this.activate = true;
    },

    getTotal () {
      let x = 1;
      let y = 1;
      if (this.gridX > 1) {
        x = Infinity;
      }
      if (this.gridY > 1) {
        y = Infinity;
      }
      return ipoint(x, y);
    },

    getRoot () {
      if (!this.rootGlobal) {
        return this.$el;
      }
      return null;
    }
  }
};

</script>

<style lang="postcss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: auto;

  &.scroll-mirror {
    &.scroll-horizontal {
      direction: rtl;
    }

    &.scroll-vertical {
      transform: rotateZ(180deg);
      direction: rtl;
    }

    &.scroll-vertical.scroll-horizontal {
      transform: rotateX(180deg);
      direction: rtl;
    }
  }
}

li {
  display: flex;
  width: 100%;

  @nest .scroll-vertical & {
    align-items: center;
    justify-content: center;
  }

  @nest .scroll-horizontal & {
    align-items: center;
    justify-content: auto;
  }

  @nest .scroll-vertical.scroll-horizontal & {
    align-items: initial;
    justify-content: initial;
  }
}
</style>
