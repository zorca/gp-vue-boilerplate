<template>
  <li :id="id" :style="cssVars()">
    hello {{ id }}
  </li>
</template>

<script>
// import { viewportObserver } from '@/service/viewport';
// import { getElementSize } from '@/utils/element';

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
    options: {
      type: Object,
      default () {
        return {};
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
        this.observable.reobserve(this.$el);
        // this.options.current = this.options.offset + this.options.index;
      }
    }
  },

  mounted () {
    this.observable.observe(this.$el);
  },

  destroyed () {
    console.log(this.observable);
    this.observable.unobserve(this.$el);
  },

  methods: {
    onResize () {
      // const size = getElementSize(this.$el);
      // console.log(size);
    },

    cssVars () {
      // console.log(this.options);
      return {
        '--x': 0,
        '--y': `${this.options.offset * 100 * this.options.numEntries}%`
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
  height: 5em;
  box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);

  /* transition-duration: 100ms;
  transition-property: transform; */
  transform: translate3d(var(--x), var(--y), 0);
}
</style>
