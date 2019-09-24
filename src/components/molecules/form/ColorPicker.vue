<template>
  <div class="color-picker">
    <canvas
      ref="canvas"
      :width="dimension.x"
      :height="dimension.y"
      @click="onClick"
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
        return Math.PI * 0;
      }
    }
  },

  data () {
    return {
      context: null,
      dimension: point(),
      paths: []
    };
  },

  mounted () {
    console.log();
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
    onClick (e) {
      const normVector = getNormalizedPointer(e, this.$refs.canvas.getBoundingClientRect());
      const vector = point(() => normVector * (this.dimension / 2) + (this.dimension / 2));
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
      this.$nextTick(this.draw);
    },

    prepare () {
      const paths = Array(this.sections).fill(null);
      this.paths = paths.map((value, currentSection, array) => {
        const numSections = array.length;
        const outerRadius = (1 - currentSection / numSections) / 2;
        const innerRadius = (1 - (currentSection + 1) / numSections) / 2;
        const lightness = (currentSection + 1) / (numSections + 1) * 100;
        const numSegments = getNumberOfSegmentsBySection(this.segments, currentSection, numSections);
        return getPathSegments(this.context, outerRadius, innerRadius, this.alignmentRad, numSegments, lightness);
      });
    },

    draw () {
      setupCanvas(this.context);
      this.paths.forEach((section) => {
        section.forEach((segment) => {
          drawPathSegment(this.context, segment);
        });
      });
    }
  }
};

function getNumberOfSegmentsBySection (numSegments, currentSection, numSections) {
  return Math.pow(numSegments, (numSections + 1) / 2 - Math.abs(currentSection - (numSections - 1) / 2));
}

function getPathSegments (context, outerRadius = 0.5, innerRadius = 0, alignmentRad = 0, segments = 360, lightness = 50) {
  const pathSegments = Array(segments).fill(null);
  return pathSegments.map((value, index) => {
    const rad = getSegmentRad(segments);
    const startRad = rad * index;
    const midRad = startRad + rad * 0.5;
    const endRad = startRad + rad * 1;
    return {
      path: getPath(context, outerRadius, innerRadius, startRad, endRad),
      color: Color.hsl(radToDeg(midRad + alignmentRad), 100, lightness).toString()
    };
  });
}

function getPath (context, outerRadius, innerRadius, startRad, endRad) {
  const path = new Path2D();
  path.arc(0, 0, outerRadius, startRad, endRad, false);
  path.arc(0, 0, innerRadius, endRad, startRad, true);
  path.closePath();
  return path;
}

function setupCanvas (context) {
  const { width, height } = context.canvas;
  const scale = point(width, height);

  context.scale(...scale.toArray());
  context.translate(0.5, 0.5);
  context.arc(0, 0, 0.5, 0, 2 * Math.PI);
  context.clip();
}

function drawPathSegment (context, segment) {
  context.fillStyle = segment.color;
  context.strokeStyle = segment.color;
  context.lineWidth = 1 / context.canvas.width;
  context.stroke(segment.path);
  context.fill(segment.path);
}

function getSegmentRad (segments) {
  return Math.PI * 2 / segments;
}

function radToDeg (rad) {
  return rad * (180 / Math.PI);
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
