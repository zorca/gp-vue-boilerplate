<template>
  <div :style="cssProps">
    <transition
      appear
      name="flicker"
      @after-enter="showDashoffset=true;"
    >
      <div class="indicator" />
    </transition>
    <svg
      :width="size.x"
      :height="size.y"
      :viewBox="viewBox"
    >
      <transition
        appear
        name="dashoffset"
        @after-enter="$emit('end')"
      >
        <path
          v-if="showDashoffset"
          :d="`
          M${0.5} ${0.5}
          L${Math.max(size.x - size.y, 0.5)} ${Math.max(size.y - size.x, 0.5) }
          L${size.x} ${size.y}
        `"
          pathLength="100"
        />
      </transition>
    </svg>
  </div>
</template>

<script>
import { Point } from '@js-basics/vector';

export default {
  props: {
    start: {
      type: Point,
      default () {
        return null;
      }
    },
    end: {
      type: Point,
      default () {
        return null;
      }
    }
  },

  data () {
    return {
      radius: 0,
      showDashoffset: false
    };
  },

  computed: {
    size () {
      return this.end.calc(v => Math.abs(v - this.start));
    },
    viewBox () {
      return `0 0 ${this.size.x} ${this.size.y}`;
    },
    cssProps () {
      return {
        top: `${this.start.y}px`,
        left: `${this.start.x}px`,
        transform: this.getRotation()
      };
    }
  },

  mounted () {
    this.radius = Number(global.getComputedStyle(this.$el).getPropertyValue('--radius'));
  },

  methods: {
    getRotation () {
      let style = [];
      if (this.start.x > this.end.x) {
        style.push('translateX(calc(-100%)) rotateY(180deg)');
      }
      if (this.start.y > this.end.y) {
        style.push('translateY(-100%) rotateX(180deg)');
      }
      return style.join(' ');
    }
  }
};
</script>

<style lang="postcss" scoped>
div {
  --color: black;
  --radius: 5;

  position: fixed;

  & div.indicator {
    width: 10px;
    height: 10px;
    background: var(--color);
    transform: translate(-50%, -50%);

    &.flicker-enter-active {
      animation-name: flicker;
      animation-duration: 350ms;
    }
  }

  & svg {
    & path {
      fill: none;
      stroke: var(--color);
      stroke-dasharray: 100 100;
      stroke-dashoffset: 0;
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      transition-duration: 350ms;
      transition-property: stroke-dashoffset;
    }

    & .dashoffset-enter {
      stroke-dashoffset: 100;
    }
  }
}

@keyframes flicker {
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
