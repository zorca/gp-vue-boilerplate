<template>
  <intersect
    :threshold="[0]"
    :root-margin="margin"
    @leave="leave"
  >
    <li
      :style="transform"
      :data-pos="num"
    >
      <slot :config="config" />
    </li>
  </intersect>
</template>

<script>
import { subscribeToViewport } from '../../../service/viewport';

export default {
  props: {
    master: {
      type: Boolean,
      default: false
    },
    num: {
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
    step: {
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
      segment: { x: 0, y: 0 },
      size: {
        x: 0,
        y: 0
      },
      index: 0,
      position: { x: 0, y: 0 },
      config: {},
      margin: '100% 0px 100% 0px'
    };
  },

  watch: {
    items: {
      handler () {
        this.config = this.items[this.index];
      },
      deep: false
    }
  },

  created () {
    // console.log('AHA');
    // console.log(this.step.y);
  },

  mounted () {
    this.onResize();
    this.resizeSubscriber = subscribeToViewport(this.onResize);
  },

  destroyed () {
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  },

  methods: {
    onResize () {
      this.updateSize();
      this.updateElement();
      if (this.master) {
        this.$parent.$emit('resize', this.size);
      }
    },

    leave (e) {
      this.updateCurrentSegmentIndex(e);

      // console.log(this.segment.y, this.num, e.scroll.direction.y);
      this.updateElement();
      if (this.master) {
        this.$parent.$emit('next', this.segment);
      }
    },

    updateSize () {
      let bounds = this.$el.getBoundingClientRect();
      this.size.x = bounds.width;
      this.size.y = bounds.height;
      this.margin = `${this.size.y * this.offset.y}px ${this.size.x * this.offset.x}px`;
    },

    updateElement () {
      this.index = this.getCurrentIndex();
      if (this.items[this.index]) {
        this.updateContent();
        this.updatePosition();
      } else {
        if (this.segment.y < 1) {
          return;
        }
        this.segment.y--;
      }
    },

    updateContent () {
      this.config = this.items[this.index];
    },

    updatePosition () {
      this.position.x = this.range.x * this.segment.x * 100;
      this.position.y = this.range.y * this.segment.y * 100;
      this.$nextTick(() => {
        // console.log(this.position.y);
        this.$el.style.transform = getTransform(this.position.x, this.position.y);
      });
    },

    updateCurrentSegmentIndex (e) {
      this.segment.x = clampMin(this.segment.x + (e.scroll.direction.x / Math.abs(e.scroll.direction.x)) || 0);
      this.segment.y = clampMin(this.segment.y + (e.scroll.direction.y / Math.abs(e.scroll.direction.y)) || 0);
    },

    getCurrentIndex () {
      return this.range.x * this.range.y * this.segment.y + this.num;
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
  box-sizing: border-box;
  display: block;
  width: 20%;
  overflow: hidden;
  border: 1px solid black;

  &.tile {
    float: left;
  }
}
</style>
