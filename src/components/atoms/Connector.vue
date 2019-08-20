<template>
  <svg
    :class="{animate: active}"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <circle
      class="start"
      fill="black"
      :cx="radius"
      :cy="radius"
      :r="radius"
    />
    <path
      ref="path"
      :d="`
        M${offsetLeft} ${offsetTop}
        L${Math.max(offsetWidth - offsetHeight, offsetLeft)} ${Math.max(offsetHeight - offsetWidth, offsetTop) }
        L${offsetWidth} ${offsetHeight}
      `"
      :stroke-width="strokeWidth"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="strokeDashoffset"
      stroke="black"
      fill="none"
      vector-effect="non-scaling-stroke"
    />

    <circle
      class="end"
      fill="black"
      :cx="offsetWidth"
      :cy="offsetHeight"
      :r="radius"
    />
  </svg>
</template>

<script>
export default {
  props: {
    start: {
      type: Object,
      default () {
        return { x: 0, y: 0 };
      }
    },
    end: {
      type: Object,
      default () {
        return { x: 0, y: 0 };
      }
    },
    radius: {
      type: Number,
      default () {
        return 5;
      }
    },
    strokeWidth: {
      type: Number,
      default () {
        return 1;
      }
    }
  },

  data () {
    return {
      active: false
    };
  },

  computed: {
    length () {
      const h = this.offsetHeight - this.radius;
      const w = this.offsetWidth - this.radius;
      const a = Math.min(h, w);
      return Math.max(this.offsetWidth - this.offsetHeight, this.offsetHeight - this.offsetWidth) + Math.hypot(a, a);
    },
    width () {
      return this.end.x - this.start.x;
    },
    height () {
      return this.end.y - this.start.y;
    },
    offsetTop () {
      return this.radius;
    },
    offsetLeft () {
      return this.radius;
    },
    offsetWidth () {
      return this.width - this.radius * 2;
    },
    offsetHeight () {
      return this.height - this.radius * 2;
    },
    strokeDasharray () {
      return `${this.length} ${this.length}`;
    },
    strokeDashoffset () {
      return this.length;
    }
  },

  mounted () {
    setTimeout(() => {
      this.active = true;
    }, 1000);
  }
};
</script>

<style lang="postcss" scoped>
svg {
  & .start {
    opacity: 0;
  }

  & .end {
    opacity: 0;
    transition-delay: 750ms;
    transition-property: opacity;
  }

  & path {
    transition-delay: 500ms;
    transition-duration: 250ms;
    transition-property: stroke-dashoffset;
  }

  &.animate {
    & .start {
      animation: border-flicker 250ms linear forwards;
    }

    & .end {
      opacity: 1;
    }

    & path {
      stroke-dashoffset: 0;
    }
  }
}

@keyframes border-flicker {
  0% {
    opacity: 0.1;
  }

  33% {
    opacity: 1;
  }

  66% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
}
</style>
