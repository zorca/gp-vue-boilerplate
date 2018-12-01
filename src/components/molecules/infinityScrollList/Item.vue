<template>
  <intersect
    :threshold="[0]"
    :root-margin="margin"
    @leave="leave">
    <li :style="transform">
      <slot/>
    </li>
  </intersect>
</template>

<script>

import { subscribeOnce } from '../../../service/animationFrame';

export default {
  props: {
    onMounted: {
      type: Function,
      default() { }
    },
    offset: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    },
    range: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },

  data() {
    return {
      transform: getTransform(),
      step: { x: 0, y: 0 },
      size: {
        x: 0,
        y: 0
      },
      margin: '0px 0px 0px 0px'
    };
  },

  mounted() {
    console.log('AJA');
    setTimeout(this.updateSize, 1000);
  },

  methods: {
    leave(e) {
      this.updateStep(e);
      this.updateElement();
    },

    updateStep(e) {
      if (e.scroll.direction.x > 0) {
        this.step.x++;
      } else if (e.scroll.direction.y > 0) {
        this.step.y++;
      } else if (e.scroll.direction.x < 0 && this.step.x > 0) {
        this.step.x--;
      } else if (e.scroll.direction.y < 0 && this.step.y > 0) {
        this.step.y--;
      }
    },

    updateElement() {
      let x = this.range.x * this.size.x * this.step.x;
      let y = this.range.y * this.size.y * this.step.y;
      console.log('LEAVE', this.range.y, this.size.y, this.step.y);
      subscribeOnce(() => {
        this.$el.style.transform = getTransform(x, y);
      });
    },

    updateSize() {
      let bounds = this.$el.getBoundingClientRect();
      console.log(bounds);
      this.size.x = bounds.width;
      this.size.y = bounds.height;
      this.margin = `${this.size.y * this.offset.y}px ${this.size.x * this.offset.x}px`;

      this.updateElement();
      this.onMounted(this.size);
    }
  }
};

function getTransform(x = 0, y = 0) {
  return `translate(${x}px, ${y}px)`;
}
</script>

<style lang="postcss" scoped>
li {
  display: block;
  width: 20%;
  height: 30%;

  &.tile {
    float: left;
  }
}
</style>
