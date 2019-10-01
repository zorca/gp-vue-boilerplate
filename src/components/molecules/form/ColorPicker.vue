<template>
  <div class="color-picker">
    <atom-svg
      ref="svg"
      :definitions="definitions"
      :segments="sectionSegments"
      :highlight="highlight"
      @pointerdown.native="onStart"
    />

    <span
      ref="color"
      class="color"
      :style="cssProps"
    />
  </div>
</template>

<script>
import AtomSvg from '@/components/atoms/Svg';
import Color from 'color';
import { arc } from '@/utils/svg';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default {
  components: {
    AtomSvg
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
        return Math.PI * 1;
      }
    }
  },

  data () {
    return {
      definitions: [],
      sectionSegments: [],
      clipPath: null,
      color: null,
      active: false,
      subscriptions: [],
      highlight: {
        href: null,
        style: null
      }
    };
  },

  computed: {
    cssProps () {
      return {
        backgroundColor: this.color
      };
    }
  },

  mounted () {
    this.prepare();

    const options = { passive: true, capture: false };
    const pipe = [
      filter(() => this.active)
    ];
    this.subscriptions = [
      fromEvent(global.document, 'pointermove', options)
        .pipe(...pipe)
        .subscribe(this.onTick),
      fromEvent(global.document, 'pointerup', options)
        .pipe(...pipe)
        .subscribe(this.onEnd)
    ];
  },

  destroyed () {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
  },

  methods: {
    onStart () {
      this.active = true;
    },

    onTick (e) {
      this.highlight = {
        href: e.srcElement.getAttribute('xlink:href'),
        style: e.srcElement.getAttribute('style')
      };
      this.color = e.srcElement.getAttribute('fill');
    },

    onEnd (e) {
      this.active = false;
      this.highlight = {
        href: e.srcElement.getAttribute('xlink:href'),
        style: e.srcElement.getAttribute('style')
      };
      this.color = e.srcElement.getAttribute('fill');
    },

    prepare () {
      this.clipPath = getClipPath();
      this.definitions = createDefinitions(this.sections, this.segments);
      this.sectionSegments = createSegments(this.definitions, this.alignmentRad);
    },

  }
};

function getNumberOfSegmentsBySection (numSegments, currentSection, numSections) {
  return Math.pow(numSegments, (numSections + 1) / 2 - Math.abs(currentSection - (numSections - 1) / 2));
}

function createDefinitions (sections, segments) {
  return Array(sections).fill(null).map((value, currentSection, array) => {
    const numSections = array.length;
    const outerRadius = (1 - currentSection / (numSections + 1)) / 2;
    const innerRadius = (1 - (currentSection + 1) / (numSections + 1)) / 2;
    const numSegments = getNumberOfSegmentsBySection(segments, currentSection, numSections);
    return createDefinition(currentSection, numSegments, outerRadius, innerRadius);
  });
}

function createDefinition (id, segments, outerRadius, innerRadius) {
  const rad = getSegmentRad(segments);
  return {
    id: id,
    count: segments,
    rad: rad,
    path: arc(0, 0, 0, rad * 1, outerRadius, innerRadius)
  };
}

function createSegments (definitions, alignmentRad) {
  return definitions.map((def, defIndex, array) => {
    const lightness = (def.id + 1) / (array.length + 1) * 100;
    return Array(def.count).fill(null).map((value, index) => createSegment(index, def, lightness, alignmentRad));
  }).flat();
}

function createSegment (index, def, lightness, alignmentRad) {
  const startRad = def.rad * index;
  const midRad = startRad + def.rad * 0.5;
  return {
    id: def.id,
    rad: startRad,
    color: Color.hsl(radToDeg(midRad + alignmentRad), 100, lightness).toString()
  };
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

canvas,
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

canvas {
  visibility: hidden;
}

.color {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 15%;
  height: 15%;
  background-color: white;
  border: 5px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
