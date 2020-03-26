<template>
  <li :id="id" :style="cssVars()">
    <div>
      hello {{ value.x }} {{ value.y }}
    </div>
  </li>
</template>

<script>
import { ipoint, IPoint } from '@js-basics/vector';

export default {
  props: {
    id: {
      type: Number,
      default () {
        return 0;
      }
    },
    observable: {
      type: Object,
      default () {
        return null;
      }
    },
    offset: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    max: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    value: {
      type: IPoint,
      default () {
        return ipoint();
      }
    }
  },

  data () {
    return {

    };
  },

  watch: {
    'options.offset': {
      handler () {
        // this.observable.reobserve(this.$el);
        // this.options.index.current = this.options.offset * this.options.numEntries + this.options.index.initial;
      }
    }
  },

  mounted () {
    this.observable.observe(this.$el);
  },

  destroyed () {
    this.observable.unobserve(this.$el);
  },

  methods: {
    cssVars () {
      return {
        '--x': `${this.offset.x * 100 * this.max.x}%`,
        '--y': `${this.offset.y * 100 * this.max.y}%`
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
li {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10em;
  box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);
  transform: translate3d(var(--x), var(--y), 0);

  @nest .scroll-mirror.scroll-direction-vertical & {
    transform: translate3d(var(--x), var(--y), 0) rotateZ(180deg);
  }

  @nest .scroll-mirror.scroll-direction-horizontal & {
    transform: translate3d(calc(var(--x) * -1), var(--y), 0);
  }
}
</style>
