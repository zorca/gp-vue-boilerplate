<template>
  <span
    class="radial-slider"
    touch-action="none"
    @pointermove="onTick"
    @pointerup="onEnd"
  >
    <atom-circle :model="model" />

    <span class="handle">
      <span
        class="knob"
        @pointerdown="onStart"
      />
    </span>

    <molecule-form-numeric
      :label="label"
      :model="model"
      :mask="mask"
      :min="min"
      :max="max"
    />
  </span>
</template>

<script>
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';
import AtomCircle from '@/components/atoms/Circle';
import { Victor } from '@js-basics/vector';

export default {
  components: {
    MoleculeFormNumeric,
    AtomCircle
  },

  props: {
    label: {
      type: String,
      default () {
        return 'Radial Slider';
      }
    },
    model: {
      type: Object,
      default () {
        return {};
      }
    },
    min: {
      type: Number,
      default () {
        return 0;
      }
    },
    max: {
      type: Number,
      default () {
        return 100;
      }
    },
    circumference: {
      type: Number,
      default () {
        return Math.PI * 2;
      }
    },
    mask: {
      type: Object,
      default () {
        return {};
      }
    }
  },

  data () {
    return {
      active: false
    };
  },

  methods: {
    onStart () {
      this.active = true;
    },

    onTick (e) {
      if (this.active) {
        const normVector = calcNormalizedLocalPointerVector(e, this.$el.getBoundingClientRect());
        const elemRad = getRotation(window.getComputedStyle(this.$el).transform);
        const vector = rotateVectorByRad(normVector, -elemRad);
        const rad = calcRad(vector);
        console.log('dhfdhf', this.model.value);
        const radNormalized = rad / (this.circumference);
        if (Math.abs(radNormalized - this.model.value) < 0.5) {

          this.model.value = clamp(radNormalized) * this.circumferenceFactor;
          this.$el.style.setProperty('--rad', clamp(rad, this.circumference));
        }
      }
    },

    onEnd () {
      this.active = false;
    }
  }
};

function calcNormalizedLocalPointerVector (e, boundingClientRect) {
  const { x, y, width, height } = boundingClientRect;
  const elemPos = new Victor(x, y);
  const elemHalfSize = new Victor(() => new Victor(width, height) / 2);
  const touchPos = new Victor(e.x, e.y);
  return new Victor(() => (touchPos - elemPos - elemHalfSize) / elemHalfSize);
}

function calcRad (vector) {
  return Math.atan2(vector.y, vector.x) + Math.PI;
}

// source: https://matthew-brett.github.io/teaching/rotation_2d.html
function rotateVectorByRad (vector, rad) {
  const x = Math.cos(rad) * vector.x - Math.sin(rad) * vector.y;
  const y = Math.sin(rad) * vector.x + Math.cos(rad) * vector.y;
  return new Victor(x, y);
}

function clamp (value, min = 1) {
  return Math.min(min, value);
}

function getRotation (matrix) {
  let m = new DOMMatrix(matrix);
  return Math.atan2(m.b, m.a);
}
</script>

<style lang="postcss" scoped>
span {
  display: inline-block;
}

.radial-slider {
  --rad: 0;
  --padding: 20px;

  position: relative;
  padding: var(--padding);
  overflow: hidden;
  transform: rotate(90deg);

  & svg {
    width: 100%;
  }

  & .handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(calc(var(--rad) * 1rad));

    & .knob {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      margin-left: -50%;
      border: 1px solid black;
      border-radius: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
