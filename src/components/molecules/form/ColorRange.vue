<template>
  <div
    :class="['color-range', direction.x ? 'vertical' : 'horizontal']"
    :style="cssProps"
  >
    <canvas
      ref="canvas"
      :width="dimension.x"
      :height="dimension.y"
      @pointerdown="onStart"
    />
    <span class="container">
      <span class="selector">
        <svg viewBox="0 0 1 1" />
      </span>
    </span>
  </div>
</template>

<script>
import Color from 'color';
import { getNormalizedPointer } from '@/utils/pointer';
import { point } from '@js-basics/vector';
import { subscribeToViewport } from '@/service/viewport';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default {
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
      context: null,
      pos: point(),
      dimension: point(),
      direction: point(1, 0)
    };
  },

  computed: {
    cssProps () {
      return {
        '--size': `${1 / this.parts * 100}%`,
        '--x': `${this.pos.x * this.parts}%`,
        '--y': `${this.pos.y * this.parts}%`
      };
    }
  },

  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
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
        .subscribe(this.onEnd),
      subscribeToViewport(this.onResize)
    ];
  },

  destroyed () {
    this.subscriptions.forEach(item => {
      item.unsubscribe();
    });
  },

  methods: {
    onResize () {
      const style = global.getComputedStyle(this.$refs.canvas);
      this.dimension = point(parseInt(style.width), parseInt(style.height));
      this.$nextTick(this.draw);
    },

    onStart (e) {
      this.active = true;
      this.onTick(e);
    },

    onTick (e) {
      const normVector = getNormalizedPointer(e, this.$refs.canvas.getBoundingClientRect());
      this.pos = point(normVector.x, normVector.y)
        // convert value range from -1/+1 to 0/1
        .calc((p) => (p + 1) / 2)
        // clamp to available range
        .calc((p) => Math.min(Math.max(p, 0), 1 - 1 / this.parts))
        // round position by displayed color parts
        .calc((p) => Math.floor(p * this.parts) / this.parts)
        // calc percentaged css pos value by axis
        .calc((p) => p * 100 * this.direction);
    },

    onEnd () {
      this.active = false;
    },

    draw () {
      this.direction = getDirection(this.dimension);
      const pos = Math.max(this.pos.x, this.pos.y);
      this.pos = point(pos, pos)
        .calc((p) => p * this.direction);
      drawColorRange(this.context, this.hex, this.parts, this.direction);
    }
  }
};

function getDirection (dimension) {
  if (dimension.x < dimension.y) {
    return point(0, 1);
  }
  return point(1, 0);
}

function drawColorRange (context, hex, parts, direction) {
  const size = point(1, 1).calc((p) => (p / parts * direction) || 1);
  const color = Color(hex).hsl();
  for (var part = 0; part < parts; part += 1) {
    const pos = point(() => part / parts * direction);
    const lightness = part / (parts - 1) * 100;
    drawRect(context, pos, size, color.lightness(lightness).toString());
  }
}

function drawRect (context, pos, size, color) {
  const { width, height } = context.canvas;
  context.beginPath();
  context.rect(pos.x * width, pos.y * height, size.x * width, size.y * height);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = color;
  context.lineWidth = 0;
  context.stroke();
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

    & span.selector {
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

    & span.selector svg {
      left: 50%;
      width: var(--corner-size);
    }
  }

  &.horizontal span.container {
    width: 100%;
    height: var(--size);

    & span.selector svg {
      top: 50%;
      height: var(--corner-size);
    }
  }
}
</style>
