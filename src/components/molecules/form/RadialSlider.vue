<template>
  <span
    class="radial-slider"
    :class="[{ 'transition-active': !active }]"
    touch-action="none"
  >

    <atom-circle
      class="indicator"
      :progress="Number(1)"
      :range="range"
    />

    <atom-circle
      class="progress"
      :progress="progress"
      :range="range"
    />

    <span class="handle">
      <span
        class="knob"
        @pointerdown="onStart"
      />
    </span>

    <molecule-form-numeric
      class="numeric-input"
      :model="model"
      :min="min"
      :max="max"
    />

  </span>
</template>

<script>
import AtomCircle from '@/components/atoms/Circle';
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';
import { clamp, getRadOfVector, getRadOfElement, addRadToVector } from '@/utils/math';
import { getNormalizedPointer } from '@/utils/pointer';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

export default {
  components: {
    AtomCircle,
    MoleculeFormNumeric
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
        return 1000;
      }
    },
    easing: {
      type: Function,
      default (value) {
        return value * value;
      }
    },
    reverseEasing: {
      type: Function,
      default (value) {
        return Math.sqrt(value);
      }
    },
    circumference: {
      type: Number,
      default () {
        return Math.PI * 2;
      }
    }
  },

  data () {
    return {
      active: false,
      subscriptions: []
    };
  },

  computed: {
    range () {
      return this.circumference / (Math.PI * 2);
    },
    circumferenceCenter () {
      return this.circumference / 2;
    },
    progress () {
      console.log(this.model.value, 'muss zurückgerechnet werden - wertebereich 0-1');
      return this.reverseEasing(this.model.value / this.max);
    }
  },

  watch: {
    'model.value': {
      handler () {
        this.$el.style.setProperty('--rad', this.progress * 2 * Math.PI * this.range);
      }
    }
  },

  mounted () {
    const options = { passive: true, capture: false };
    const pipe = [
      filter(() => this.active)
    ];
    this.subscriptions = [
      fromEvent(global.document, 'pointermove', options).pipe(...pipe).subscribe(this.onTick),
      fromEvent(global.document, 'pointerup', options).pipe(...pipe).subscribe(this.onEnd)
    ];
  },

  destroyed () {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  },

  methods: {
    onStart () {
      this.active = true;
    },

    onTick (e) {
      const normVector = getNormalizedPointer(e, this.$el.getBoundingClientRect());
      const offsetRad = getRadOfElement(this.$el);

      // mirror vector with calculated css rotation offset
      // to prevent 0 to Math.PI jump at the beginning of the available range
      // to set the zero point to the center of the available range
      // to get a resulting radian range of -Math.PI to + Math.PI
      const vector = addRadToVector(normVector, -offsetRad - Math.PI - this.circumferenceCenter);
      // mirror back the resulting radian of the mirrored vector
      const rad = getRadOfVector(vector) - Math.PI;
      // normalize & clamp rad to the range of -1 to +1
      const normRad = clamp(rad / this.circumferenceCenter, -1, 1);
      // normalize rad to the range of 0 to 1
      const normValue = (normRad + 1) / 2;
      // move the back jump when overwinding the handle
      if (Math.abs(this.progress - normValue) < 0.5) {
        this.model.value = this.easing(normValue) * this.max;
      } else {
        this.model.value = Math.round(this.progress) * this.max;
      }
    },

    onEnd () {
      this.active = false;
    }
  }
};
</script>

<style lang="postcss" scoped>
span {
  display: inline-block;
}

.radial-slider {
  --rad: 0;
  --stroke-width: 5%;
  --handle-size: 20%;
  --translate: calc(var(--handle-size) / 2 - var(--stroke-width) / 2);
  --size: calc(100% - var(--handle-size) + var(--stroke-width));

  position: relative;
  width: 100%;
  overflow: hidden;
  transform: rotate(0deg);

  &::before {
    display: block;
    padding-top: 100%;
    content: "";
  }

  & svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: var(--size);
    max-width: 100%;
    margin: auto;

    &.progress >>> circle {
      stroke: #0f0;
      stroke-width: var(--stroke-width);
    }

    &.indicator >>> circle {
      stroke: #ddd;
      stroke-width: var(--stroke-width);
    }
  }

  & .handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(calc(var(--rad) * 1rad)) translateX(var(--translate));

    & .knob {
      position: relative;
      top: 50%;
      width: var(--handle-size);
      height: var(--handle-size);
      margin-left: calc(var(--stroke-width) / 2);
      border: 1px solid black;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }

  & .numeric-input {
    position: absolute;
    top: 0;
  }
}

.transition-active .handle {
  transition-duration: 350ms;
  transition-property: transform;
}
</style>

