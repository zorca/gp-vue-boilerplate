<template>
  <article
    :style="cssVars()"
    :data-index="JSON.stringify({'x': index.x, 'y': index.y})"
  >
    <slot :index="index" />
  </article>
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
article {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 10em;
  box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);
  transform: translateX(var(--x)) translateY(var(--y));

  @nest .scroll-mirror.scroll-vertical & {
    transform: translateX(var(--x)) translateY(var(--y)) rotateZ(180deg);
  }

  @nest .scroll-mirror.scroll-horizontal & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y));
  }

  @nest .scroll-mirror.scroll-vertical.scroll-horizontal & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y)) rotateX(180deg);
  }
}
</style>
