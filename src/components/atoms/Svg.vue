<template>
  <svg
    viewBox="0 0 1 1"
    touch-action="none"
  >
    <defs>
      <clipPath id="clip">
        <circle
          cx="0"
          cy="0"
          r="0.5"
        />
      </clipPath>
      <path
        v-for="(def, index) in definitions"
        :id="`def_${def.id}`"
        :key="index"
        :d="def.path"
        vector-effect="non-scaling-stroke"
      />
    </defs>
    <g
      style="transform: translate(0.5px, 0.5px)"
      clip-path="url(#clip)"
    >
      <use
        v-for="(segment, index) in segments"
        :id="`seg_${index}`"
        :key="index"
        :xlink:href="`#def_${segment.id}`"
        :style="`transform: rotate(${segment.rad}rad)`"
        :stroke="segment.color"
        :fill="segment.color"
        stroke-width="1"
      />

    </g>
    <g style="transform: translate(0.5px, 0.5px)">
      <use
        id="highlight"
        :xlink:href="highlight.href"
        :style="highlight.style"
        stroke="white"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script>
import { ipoint, iPoint } from '@js-basics/vector';

export default {
  props: {
    rotation: {
      type: iPoint,
      default () {
        return ipoint(1, 0);
      }
    },
    definitions: {
      type: Array,
      default () {
        return [];
      }
    },
    segments: {
      type: Array,
      default () {
        return [];
      }
    },
    clipPath: {
      type: global.Point2D,
      default () {
        return null;
      }
    },
    highlight: {
      type: Object,
      default () {
        return {
          href: null,
          style: null
        };
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
#highlight {
  fill: none;
  stroke-width: 4;
}
</style>
