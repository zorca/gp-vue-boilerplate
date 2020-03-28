<template>
  <li
    :style="cssVars()"
    :data-index="JSON.stringify({'x': index.x, 'y': index.y})"
  >
    <slot>
      <div>
        hello {{ index.x }} {{ index.y }}
      </div>
    </slot>
  </li>
</template>

<script>
import { ipoint, IPoint } from '@js-basics/vector';

export default {
  props: {
    observable: {
      type: Object,
      default () {
        return null;
      }
    },
    index: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    max: {
      type: IPoint,
      default () {
        return ipoint(1, 1);
      }
    }
  },

  watch: {
    observable: {
      handler () {
        this.observable.observe(this.$el);
      }
    }
  },

  mounted () {
    if (this.observable) {
      this.observable.observe(this.$el);
    }
  },

  destroyed () {
    if (this.observable) {
      this.observable.unobserve(this.$el);
    }
  },

  methods: {
    cssVars () {
      const result = ipoint(() => Math.floor(this.index / this.max) * 100 * this.max);
      return {
        '--x': `${result.x}%`,
        '--y': `${result.y}%`
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

  @nest .scroll-direction-horizontal & {
    width: 25%;
  }

  @nest .scroll-mirror.scroll-direction-vertical & {
    transform: translate3d(var(--x), var(--y), 0) rotateZ(180deg);
  }

  @nest .scroll-mirror.scroll-direction-horizontal & {
    transform: translate3d(calc(var(--x) * -1), var(--y), 0);
  }
}
</style>
