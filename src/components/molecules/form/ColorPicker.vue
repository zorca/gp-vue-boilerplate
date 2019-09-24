<template>
  <div class="color-picker">
    <canvas
      ref="canvas"
      :width="dimension.x"
      :height="dimension.y"
      @click="click"
    />
    <!-- <span
      ref="color"
      class="color"
    /> -->
  </div>
</template>

<script>
import { getNormalizedPointer } from '@/utils/pointer';
import { point } from '@js-basics/vector';
import { subscribeToViewport } from '@/service/viewport';
import Color from 'color';

export default {
  props: {
    segments: {
      type: Number,
      default () {
        return 7;
      }
    },
    sections: {
      type: Number,
      default () {
        return 5;
      }
    },
    alignmentRad: {
      type: Number,
      default () {
        return 0; // Math.PI
      }
    }
  },

  data () {
    return {
      context: null,
      dimension: point(),
      center: point(),
      paths: []
    };
  },

  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
    this.prepare();
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
    click (e) {
      const normVector = getNormalizedPointer(e, this.$refs.canvas.getBoundingClientRect());
      const vector = point(() => normVector * this.center + this.center);
      const data = this.context.getImageData(vector.x, vector.y, 1, 1).data;
      const [
        , , , alpha
      ] = data;

      if (alpha !== 0) {
        // this.$refs.color.style.backgroundColor = color.to.rgb(data);
        console.log(Color(data).toString());
      }
    },

    onResize () {
      const style = global.getComputedStyle(this.$refs.canvas);
      this.dimension = point(parseInt(style.width), parseInt(style.height));
      this.center = point(() => this.dimension / 2);
      this.$nextTick(this.draw);
    },

    prepare () {
      for (let i = 0; i < this.sections; i++) {
        const outerRadius = (1 - i / this.sections) / 2;
        const innerRadius = (1 - (i + 1) / this.sections) / 2;
        const lightness = (i + 1) / (this.sections + 1) * 100;
        // calc number of segments per donut
        const segments = Math.pow(this.segments, (this.sections + 1) / 2 - Math.abs(i - (this.sections - 1) / 2));
        this.paths.push(getPathSegments(this.context, outerRadius, innerRadius, this.alignmentRad, segments, lightness));
      }
    },

    draw () {
      setupCanvas(this.context);
      this.paths.forEach((section) => {
        section.forEach((segment) => {
          drawPathSegment(this.context, segment.path, segment.color);
        });
      });
    }
  }
};

function getPathSegments (context, outerRadius = 0.5, innerRadius = 0, alignmentRad = 0, segments = 360, lightness = 50) {
  const pathSegments = [];
  for (let startAngle = alignmentRad; startAngle <= Math.PI * 2 + alignmentRad; startAngle += Math.PI * 2 / segments) {
    const midAngle = startAngle + (Math.PI * 2 / segments) * 0.5;
    const endAngle = startAngle + (Math.PI * 2 / segments) * 1;
    pathSegments.push({
      path: getPathSegment(context, outerRadius, innerRadius, startAngle, endAngle),
      color: Color.hsl(midAngle * (180 / Math.PI), 100, lightness).toString()
    });
  }
  return pathSegments;
}

function getPathSegment (context, outerRadius, innerRadius, startAngle, endAngle) {
  const path = new Path2D();
  path.arc(0, 0, outerRadius, startAngle, endAngle, false);
  path.arc(0, 0, innerRadius, endAngle, startAngle, true);
  path.closePath();
  return path;
}

function setupCanvas (context) {
  const { width, height } = context.canvas;
  const scale = point(width, height);
  const translation = point(() => scale / 2);

  context.translate(...translation.toArray());
  context.scale(...scale.toArray());
  context.arc(0, 0, 0.5, 0, 2 * Math.PI);
  context.clip();
}

function drawPathSegment (context, path, fillStyle = null) {
  context.fillStyle = fillStyle;
  context.strokeStyle = fillStyle;
  context.lineWidth = 1 / context.canvas.width;
  context.stroke(path);
  context.fill(path);

}
</script>

<style lang="postcss" scoped>
.color-picker {
  position: relative;
  width: 100%;
  padding-top: 100%;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.color {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 33%;
  height: 33%;
  background-color: white;
  border: 10px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
