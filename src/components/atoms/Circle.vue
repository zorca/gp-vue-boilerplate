<template>
  <svg :viewBox="`0 0 ${size} ${size}`">
    <circle
      fill="none"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="strokeDashoffset"
      :vector-effect="vectorEffect"
      :cx="center"
      :cy="center"
      :r="radius"
    />
  </svg>
</template>

<script>
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';

export default {
  props: {
    size: {
      type: Number,
      default () {
        return 100;
      }
    },
    progress: {
      type: Number,
      default () {
        return 0;
      }
    },
    range: {
      type: Number,
      default () {
        return 1;
      }
    }
  },

  data () {
    return {
      dimension: { x: 0, y: 0 },
      radius: 0,
      vectorEffect: 'default',
      scaling: false
    };
  },

  computed: {
    center () {
      return this.size / 2;
    },
    circumference () {
      return (2 * Math.PI * this.radius) * this.dimension.x / this.size * this.range;
    },
    strokeDasharray () {
      if (this.scaling) {
        return (this.circumference / this.dimension.x * 100) + ' ' + (this.circumference / this.dimension.x * 100 / this.range);
      }
      return this.circumference + ' ' + this.circumference / this.range;
    },
    strokeDashoffset () {
      if (this.scaling) {
        return (this.circumference / this.dimension.x * 100) - (this.progress * this.circumference / this.dimension.x * 100);
      }
      return this.circumference - this.progress * this.circumference;
    }
  },

  watch: {
    dimension: {
      handler () {
        let strokeWidth = window.getComputedStyle(this.$el.querySelector('circle')).strokeWidth;
        if (/px$/.test(strokeWidth)) {
          this.radius = (this.dimension.x - parseInt(strokeWidth)) / this.dimension.x / 2 * this.size;
          this.scaling = false;
          this.vectorEffect = 'non-scaling-stroke';
        } else {
          console.log(parseInt(strokeWidth));
          this.radius = this.center - (parseInt(strokeWidth) / 2);
          this.scaling = true;
          this.vectorEffect = 'default';
        }
      }
    }
  },

  mounted () {
    fromEvent(window, 'resize')
      .pipe(startWith({}))
      .subscribe(() => {
        this.dimension = {
          x: this.$el.clientWidth,
          y: this.$el.clientHeight
        };
      });
  }
};
</script>

<style lang="postcss" scoped>
svg {
  display: block;
  transform: rotateZ(-180deg);

  & circle {
    stroke: #0f0;
    stroke-width: 10px;
  }
}
</style>
