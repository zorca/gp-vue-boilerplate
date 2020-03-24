<template>
  <li :id="id" :style="cssVars()">
    <div>
      hello {{ id }}
    </div>
  </li>
</template>

<script>
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
      type: Number,
      default () {
        return 0;
      }
    },
    max: {
      type: Number,
      default () {
        return 0;
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
        '--x': 0,
        '--y': `${this.offset * 100 * this.max}%`
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10em;
  box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);

  /* transition-duration: 100ms;
  transition-property: transform; */
  transform: translate3d(var(--x), var(--y), 0);

  @nest .scroll-bottom-up & {
    transform: translate3d(var(--x), var(--y), 0) rotateZ(180deg);
  }
}
</style>
