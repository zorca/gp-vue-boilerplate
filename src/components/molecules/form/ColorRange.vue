<template>
  <div
    :class="['color-range', orientation.x ? 'vertical' : 'horizontal']"
    :style="cssProps"
  >
    <atom-canvas
      :segments="segments"
      :rotation="orientation"
      @pointerdown.native="onStart"
      @resize="onResize"
    />
    <span class="container">
      <span class="handle">
        <svg viewBox="0 0 1 1" />
      </span>
    </span>
  </div>
</template>

<script>
import Color from 'color';
import AtomCanvas from '@/components/atoms/Canvas';
import { getNormalizedPointer } from '@/utils/pointer';
import { point } from '@js-basics/vector';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default {
  components: {
    AtomCanvas
  },

  props: {
    parts: {
      type: Number,
      default () {
        return 20;
      }
    },
    hex: {
      type: String,
      default () {
        return '#000000';
      }
    }
  },

  data () {
    return {
      handlePosition: point(),
      orientation: point(1, 0),
      segments: []
    };
  },

  computed: {
    cssProps () {
      return {
        '--size': `${1 / this.parts * 100}%`,
        '--x': `${this.handlePosition.x * this.parts}%`,
        '--y': `${this.handlePosition.y * this.parts}%`
      };
    }
  },

  mounted () {
    this.prepare(this.parts, this.hex);

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
    prepare (parts, hex) {
      this.segments = getSegments(parts, hex);
    },

    onStart (e) {
      this.active = true;
      this.onTick(e);
    },

    onTick (e) {
      const normVector = getNormalizedPointer(e, this.$el.getBoundingClientRect());
      this.handlePosition = point(normVector.x, normVector.y)
        // convert value range from -1/+1 to 0/1
        .calc((p) => (p + 1) / 2)
        // clamp to available range
        .calc((p) => Math.min(Math.max(p, 0), 1 - 1 / this.parts))
        // round position by displayed color parts
        .calc((p) => Math.floor(p * this.parts) / this.parts)
        // calc percentaged css pos value by axis
        .calc((p) => p * 100 * this.orientation);
    },

    onEnd () {
      this.active = false;
    },

    onResize (dimension) {
      const pos = Math.max(this.handlePosition.x, this.handlePosition.y);
      this.orientation = getOrientation(dimension);
      this.handlePosition = point(pos, pos).calc((p) => p * this.orientation);
    }
  }
};

function getOrientation (dimension) {
  if (dimension.x < dimension.y) {
    return point(0, 1);
  }
  return point(1, 0);
}

function getSegments (parts, hex) {
  const color = Color(hex).hsl();
  return Array(parts).fill(null).map((value, index) => {
    const lightness = index / (parts - 1) * 100;
    return {
      path: getPath(getSegmentPosition(index, parts), getSegmentSize(parts)),
      color: color.lightness(lightness).toString()
    };
  });
}

function getSegmentSize (parts) {
  return point(1, 1).calc((p) => (p / parts * point(1, 0)) || 1);
}

function getSegmentPosition (index, num) {
  return point(() => index / num * point(1, 0) - 0.5);
}

function getPath (pos, size) {
  const path = new Path2D();
  path.rect(pos.x, pos.y, size.x + 1, size.y);
  path.closePath();
  return path;
}
</script>

<style lang="postcss" scoped>
.color-range {
  --x: 0%;
  --y: 0%;
  --size: 100%;
  --corner-size: 40%;
  --border-size: 2px;

  position: relative;
  width: auto;
  margin: var(--border-size);

  & canvas {
    display: block;
    width: 100%;
    height: 100px;
    border-radius: 10px;

    @media (--xs) {
      height: 1000px;
    }
  }

  & span.container {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    pointer-events: none;
    transform: translate(var(--x), var(--y));

    & span.handle {
      box-sizing: content-box;
      display: block;
      width: 100%;
      height: 100%;
      margin-top: calc(var(--border-size) * -1);
      margin-left: calc(var(--border-size) * -1);
      overflow: hidden;
      border: var(--border-size) solid white;
      border-radius: 10px;
      box-shadow: 0 0 5px black, inset 0 0 5px black;

      & svg {
        position: relative;
        background: white;
        transform: translate(-50%, calc(-50% - 2px)) rotate(45deg);
      }
    }
  }

  &.vertical span.container {
    width: var(--size);
    height: 100%;

    & span.handle svg {
      left: 50%;
      width: var(--corner-size);
    }
  }

  &.horizontal span.container {
    width: 100%;
    height: var(--size);

    & span.handle svg {
      top: 50%;
      height: var(--corner-size);
    }
  }
}
</style>
