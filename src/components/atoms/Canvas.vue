<template>
  <canvas
    :width="dimension.x"
    :height="dimension.y"
    @click="onClick"
  />
</template>

<script>
import { ipoint, iPoint } from '@js-basics/vector';
import { subscribeToViewport } from '@/service/viewport';
import { getNormalizedPointer } from '@/utils/pointer';

export default {
  props: {
    rotation: {
      type: iPoint,
      default () {
        return ipoint(1, 0);
      }
    },
    segments: {
      type: Array,
      default () {
        return [];
      }
    },
    clipPath: {
      type: global.Point2D,
      default () {
        return null;
      }
    }
  },

  data () {
    return {
      dimension: ipoint()
    };
  },

  mounted () {
    this.context = this.$el.getContext('2d');
    this.subscriptions = [
      subscribeToViewport(this.onResize)
    ];
  },

  destroyed () {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
  },

  methods: {
    setup () {
      const { width, height } = this.context.canvas;
      this.context.scale(width, height);
      this.context.translate(0.5, 0.5);
      this.context.rotate(this.rotation.getRad());

      if (this.clipPath) {
        this.context.clip(this.clipPath);
      }
    },

    draw (segments) {
      segments.forEach((segment) => {
        if (segment.forEach) {
          this.draw(segment);
        } else {
          drawSegment(this.context, segment);
        }
      });
    },

    onResize () {
      const style = global.getComputedStyle(this.$el);
      this.dimension = ipoint(parseInt(style.width), parseInt(style.height));

      this.$emit('resize', this.dimension);
      this.$nextTick(() => {
        this.setup();
        this.draw(this.segments);
      });
    },

    onClick (e) {
      const normVector = getNormalizedPointer(e, this.$el.getBoundingClientRect());
      const vector = ipoint(() => normVector * (this.dimension / 2) + (this.dimension / 2));
      const data = this.context.getImageData(vector.x, vector.y, 1, 1).data;
      this.$emit('click', data);
    }
  }
};

function drawSegment (context, segment) {
  context.fillStyle = segment.color;
  context.strokeStyle = segment.color;
  context.lineWidth = 1 / context.canvas.width;
  context.stroke(segment.path);
  context.fill(segment.path);
}
</script>

<style lang="postcss" scoped>
</style>
