<template>
  <intersect
    :threshold="[0]"
    :root-margin="margin"
    @leave="leave"
  >
    <li
      :style="transform"
      :data-pos="position"
    >
      <slot :config="config" />
    </li>
  </intersect>
</template>

<script>

import { subscribeOnce } from '../../../service/animationFrame';
import { subscribeToViewport } from '../../../service/viewport';

export default {
  props: {
    master: {
      type: Boolean,
      default: false
    },
    position: {
      type: Number,
      default: 0
    },
    offset: {
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        };
      }
    },
    range: {
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        };
      }
    },
    items: {
      type: Array,
      default () {
        return [];
      }
    }
  },

  data () {
    return {
      transform: getTransform(),
      step: { x: 0, y: 0 },
      size: {
        x: 0,
        y: 0
      },
      num: 0,
      config: {},
      margin: '100% 0px 100% 0px'
    };
  },

  watch: {
    items: {
      handler () {
        // console.log(value);
        this.updateElement();
      }
    }
  },

  mounted () {
    this.updateSize();
    if (this.master) {
      this.$parent.$emit('load', this.size);
      this.resizeSubscriber = subscribeToViewport(() => {
        this.updateSize();
        this.$parent.$emit('resize', this.size);
      });
    }
  },

  destroyed () {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  },

  methods: {
    leave (e) {
      this.updateStep(e);
      this.updateElement();
    },

    updateStep (e) {
      this.step.x = clampMin(this.step.x + (e.scroll.direction.x / Math.abs(e.scroll.direction.x)) || 0);
      this.step.y = clampMin(this.step.y + (e.scroll.direction.y / Math.abs(e.scroll.direction.y)) || 0);

      if (this.master) {
        this.$parent.$emit('next', this.step);
      }
    },

    updateElement () {
      this.num = this.range.x * this.range.y * this.step.y + this.position;
      if (this.items[this.num]) {

        let x = this.range.x * this.step.x * 100;
        let y = this.range.y * this.step.y * 100;
        let config = this.items[this.num];
        subscribeOnce(() => {
          this.config = config;
          this.$el.style.transform = getTransform(x, y);
        });
      } else {
        if (this.step.y < 1) {
          return;
        }
        this.step.y--;
      }
    },

    updateSize () {
      let bounds = this.$el.getBoundingClientRect();
      this.size.x = bounds.width;
      this.size.y = bounds.height;
      this.margin = `${this.size.y * this.offset.y}px ${this.size.x * this.offset.x}px`;

      this.updateElement();
    }
  }
};

function getTransform (x = 0, y = 0) {
  return `translate(${x}%, ${y}%)`;
}

function clampMin (value, min = 0) {
  return Math.max(value, min);
}
</script>

<style lang="postcss" scoped>
li {
  position: relative;
  display: block;
  width: 20%;

  &.tile {
    float: left;
  }
}
</style>
