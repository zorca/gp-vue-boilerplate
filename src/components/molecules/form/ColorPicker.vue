<template>
  <div class="color-picker">
    <atom-canvas
      :segments="sectionSegments"
      :clip-path="clipPath"
      @click="onClick"
    />
    <!-- <span
      ref="color"
      class="color"
    /> -->
  </div>
</template>

<script>
import AtomCanvas from '@/components/atoms/Canvas';
import Color from 'color';

export default {
  components: {
    AtomCanvas
  },

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
      sectionSegments: [],
      clipPath: null
    };
  },

  mounted () {
    this.prepare();
  },

  methods: {
    onClick (e) {
      const [
        , , , alpha
      ] = e;
      if (alpha !== 0) {
        console.log(Color(e).toString());
      }
    },

    prepare () {
      this.clipPath = getClipPath();
      this.sectionSegments = Array(this.sections).fill(null).map((value, currentSection, array) => {
        const numSections = array.length;
        const outerRadius = (1 - currentSection / numSections) / 2;
        const innerRadius = (1 - (currentSection + 1) / numSections) / 2;
        const lightness = (currentSection + 1) / (numSections + 1) * 100;
        const numSegments = getNumberOfSegmentsBySection(this.segments, currentSection, numSections);
        return getSegments(this.context, outerRadius, innerRadius, this.alignmentRad, numSegments, lightness);
      });
    }
  }
};

function getNumberOfSegmentsBySection (numSegments, currentSection, numSections) {
  return Math.pow(numSegments, (numSections + 1) / 2 - Math.abs(currentSection - (numSections - 1) / 2));
}

function getSegments (context, outerRadius = 0.5, innerRadius = 0, alignmentRad = 0, segments = 360, lightness = 50) {
  return Array(segments).fill(null).map((value, index) => {
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

function getClipPath () {
  const path = new Path2D();
  path.arc(0, 0, 0.5, 0, 2 * Math.PI);
  return path;
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
