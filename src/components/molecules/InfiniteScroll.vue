<template>
  <div class="container" :class="htmlClasses">
    <list-item
      v-for="(item, index) in items.matrix.flat()"
      :key="'list-item-' + index"
      v-bind="item"
      @added="itemAdded"
    >
      <slot name="item" :index="item.index" />
    </list-item>
    <div v-if="toggle && !activate && scroll.vertical" class="toggle horizontal">
      <slot name="toggle-button" :click="enable" />
    </div>

    <div v-if="toggle && !activate && scroll.horizontal" class="toggle vertical">
      <slot name="toggle-button" :click="enable" />
    </div>
  </div>
</template>

<story
  name="InfiniteScroll"
  group="Molecules"
  knobs="{
    toggle: { default: boolean('toggle', true) },
    mirror: { default: boolean('mirror direction', false) },
    gridX: { default: number('items on x-axis', 1) },
    gridY: { default: number('items on y-axis', 10) }
  }">
  <infinite-scroll :mirror="mirror" :toggle="toggle" :grid-x="gridX" :grid-y="gridY">
    <template lang="html" v-slot:item="props">
      <div class="item">
        hello {{ props.index.x }} {{ props.index.y }}
      </div>
    </template>
    <template lang="html" v-slot:toggle-button="props">
      <button @click="props.click">more</button>
    </template>
  </infinite-scroll>
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
    rootElement: {
      type: HTMLElement,
      default () {
        // global.document.documentElement is global viewport
        return null;
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
      },
      elements: new Set()
    };
  },

  computed: {
    htmlClasses () {
      return {
        'scroll-mirror': this.mirror,
        'scroll-horizontal': this.scroll.horizontal,
        'scroll-vertical': this.scroll.vertical
      };
    }
  },

  mounted () {
    this.scroll.horizontal = this.$el.scrollWidth > this.$el.clientWidth;
    this.scroll.vertical = this.$el.scrollHeight > this.$el.clientHeight;

    this.observable = new IntersectionObservable(Array.from(this.elements), {
      root: this.rootElement || this.$el,
      rootMargin: '-50% -50%'
    });

    if (!this.toggle) {
      this.enable();
    }
  },

  destroyed () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  },

  methods: {
    enable () {
      this.subscription = this.observable.subscribe(entry => this.items.update(entry));
      this.activate = true;
    },

    itemAdded (el) {
      this.elements.add(el);
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
    }
  }
};

</script>

<style lang="postcss" scoped>

div.container {
  display: inline-grid;
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: auto;

  &.scroll-horizontal:not(.scroll-vertical) {
    align-content: center;

    &.scroll-mirror {
      direction: rtl;
    }
  }

  &.scroll-vertical:not(.scroll-horizontal) {
    justify-content: center;

    &.scroll-mirror {
      transform: rotateZ(180deg);
      direction: rtl;
    }
  }

  &.scroll-vertical.scroll-horizontal {
    &.scroll-mirror {
      transform: rotateX(180deg);
      direction: rtl;
    }
  }
}

div.toggle {
  &.vertical {
    grid-row-start: 1;
    grid-row-end: 11;
    grid-column-start: 11;

    & button {
      position: sticky;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &.horizontal {
    grid-row-start: 11;
    grid-column-start: 1;
    grid-column-end: 11;

    & button {
      position: sticky;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
