<template>
  <div class="color-picker">
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @click="click"
    />
    <span
      ref="color"
      class="color"
    />
  </div>
</template>

<script>
import { getNormalizedPointer } from '@/utils/pointer';
import { Victor } from '@js-basics/vector';
import color from 'color-string';

export default {
  data () {
    return {
      context: null,
      width: 0,
      height: 0,
      center: null
    };
  },

  mounted () {
    const style = window.getComputedStyle(this.$refs.canvas);
    this.width = parseInt(style.width);
    this.height = parseInt(style.height);
    this.context = this.$refs.canvas.getContext('2d');
    this.center = new Victor(this.width / 2, this.height / 2);

    this.$nextTick(() => {
      drawColorWheel(this.context, this.center);
      punchOutArc(this.context, this.center, this.center.x * 0.33);
    });
  },

  methods: {
    click (e) {
      const normVector = getNormalizedPointer(e, this.$refs.canvas.getBoundingClientRect());
      const vector = new Victor(() => normVector * this.center + this.center);
      const data = this.context.getImageData(vector.x, vector.y, 1, 1).data;
      const [
        , , , alpha
      ] = data;

      if (alpha === 255) {
        this.$refs.color.style.backgroundColor = color.to.rgb(data);
      }
    }
  }
};

function drawColorWheel (context, point, radius = point.x) {
  for (var angle = 0; angle <= 360; angle += 1) {
    var startAngle = (angle - 2) * Math.PI / 180;
    var endAngle = angle * Math.PI / 180;
    drawArc(context, point, radius, startAngle, endAngle, 'hsl(' + angle + ', 100%, 50%)');
  }
}

function punchOutArc (context, point, radius = point.x) {
  context.globalCompositeOperation = 'destination-out';
  drawArc(context, point, radius, 0, 2 * Math.PI);
}

function drawArc (context, point, radius, startAngle, endAngle, fillStyle = null) {
  context.beginPath();
  context.moveTo(point.x, point.y);
  context.arc(point.x, point.y, radius, startAngle, endAngle, false);
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
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
