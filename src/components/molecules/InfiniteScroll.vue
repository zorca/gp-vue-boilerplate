<template>
  <div
    :class="htmlClasses"
  >
    <div
      v-for="(listY, indexY) in items.matrix"
      :key="'list-item-' + indexY"
      class="row"
    >
      <list-item
        v-for="(item, indexX) in listY"
        :key="'list-item-' + indexY + '-' + indexX"
        :index="item.index"
        :max="item.max"
        :observable="observable"
      >
        <slot name="item" :index="item.index" />
      </list-item>
      <div v-if="toggle && !activate && scroll.horizontal" class="toggle horizontal">
        <slot name="toggle-button" :click="enable" />
      </div>
    </div>
    <div v-if="toggle && !activate && scroll.vertical" class="toggle vertical">
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

  computed: {
    htmlClasses () {
      return {
        container: true,
        'scroll-mirror': this.mirror,
        'scroll-horizontal': this.scroll.horizontal,
        'scroll-vertical': this.scroll.vertical
      };
    }
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
        root: this.rootElement || this.$el,
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
    }
  }
};

</script>

<style lang="postcss" scoped>

div.container {
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

div.row {
  display: flex;
  width: 100%;

  @nest .scroll-vertical:not(.scroll-horizontal) & {
    align-items: center;
    justify-content: center;
  }

  @nest .scroll-horizontal:not(.scroll-vertical) & {
    align-items: center;
  }
}

div.toggle {
  position: sticky;

  &.vertical {
    left: 50%;
    transform: translateX(-50%);
  }

  &.horizontal {
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
