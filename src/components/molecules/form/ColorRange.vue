<template>
  <div
    :class="['color-range', direction.x ? 'vertical' : 'horizontal']"
    :style="cssProps"
  >
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    />
    <span class="container">
      <span class="selector" />
    </span>
  </div>
</template>

<script>
import { getNormalizedPointer } from '@/utils/pointer';
import { Point } from '@js-basics/vector';
import color from 'color-string';
import { subscribeToViewport } from '@/service/viewport';

export default {
  props: {
    parts: {
      type: Number,
      default () {
        return 20;
      }
    },
    saturation: {
      type: Number,
      default () {
        return 0;
      }
    }
  },

  data () {
    return {
      context: null,
      width: 0,
      height: 0,
      pos: new Point(),
      direction: new Point(1, 0)
    };
  },

  computed: {
    cssProps () {
      return {
        '--width': `${1 / this.parts * 100}%`,
        '--x': `${this.pos.x * this.parts}%`,
        '--y': `${this.pos.y * this.parts}%`
      };
    }
  },

  mounted () {
    this.context = this.$refs.canvas.getContext('2d');
    // console.log();
    this.subscription = subscribeToViewport(() => {
      const style = window.getComputedStyle(this.$refs.canvas);
      this.width = parseInt(style.width);
      this.height = parseInt(style.height);

      this.$nextTick(() => {
        let factor = new Point(1 / this.parts, 1);
        let direction = new Point(1, 0);

        if (this.width < this.height) {
          factor = new Point(1, 1 / this.parts);
          direction = new Point(0, 1);
        }
        this.direction = direction;
        let size = new Point(this.width, this.height)
          .calc((s) => s * factor);

        drawColorRange(this.context, this.parts, this.direction, size);
      });
    });
  },

  destroyed () {
    this.subscription.unsubscribe();
  },

  methods: {
    onPointerDown (e) {
      this.active = true;
      this.move(e);
    },

    onPointerMove (e) {
      if (this.active) {
        this.move(e);
      }
    },

    onPointerUp () {
      this.active = false;
    },

    move (e) {
      const normVector = getNormalizedPointer(e, this.$refs.canvas.getBoundingClientRect());
      const normPoint = new Point((normVector.x + 1) / 2, (normVector.y + 1) / 2);
      this.pos = new Point(() => Math.floor(normPoint * this.parts) / this.parts * 100 * this.direction);
    }
  }
};

function drawColorRange (context, parts, direction, size) {
  for (var part = 0; part < parts; part += 1) {
    const pos = new Point(() => part * size * direction);
    drawRect(context, pos, size, color.to.hsl([
      0,
      0,
      part / (parts - 1) * 100
    ]));
  }
}

function drawRect (context, pos, size, color) {
  context.beginPath();
  context.rect(pos.x, pos.y, size.x, size.y);
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
  --width: 100%;
  --corner-width: 40%;
  --border-width: 2px;

  position: relative;
  width: auto;
  margin: var(--border-width);

  & canvas {
    display: block;
    width: 100%;
    height: 100px;
    border-radius: 10px;

    @media (--xs) {
      height: 1000px;
    }
  }

  &.vertical span.container {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: var(--width);
    height: 100%;
    pointer-events: none;
    transition-duration: 350ms;
    transition-property: transform;
    transform: translate(var(--x), var(--y));
  }

  & span.selector {
    box-sizing: content-box;
    display: block;
    width: 100%;
    height: 100%;
    margin-top: calc(var(--border-width) * -1);
    margin-left: calc(var(--border-width) * -1);
    overflow: hidden;
    border: var(--border-width) solid white;
    border-radius: 10px;
    box-shadow: 0 0 5px black, inset 0 0 5px black;

    &::before {
      position: relative;
      left: 50%;
      box-sizing: border-box;
      display: block;
      width: var(--corner-width);
      padding-top: var(--corner-width);
      padding-left: var(--corner-width);
      content: "";
      background: white;
      border-bottom-right-radius: 5px;
      box-shadow: 0 0 5px black;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
}
</style>
