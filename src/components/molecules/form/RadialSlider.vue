<template>
  <span
    class="radial-slider"
    :class="[{ 'transition-active': !active }]"
    touch-action="none"
    :style="rad"
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
      :label="label"
      :min="min"
      :max="max"
    />

  </span>
</template>

<script>
import AtomCircle from '@/components/atoms/Circle';
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';
import {
  clamp,
  getRadOfVector,
  getRadOfElement,
  addRadToVector
} from '@/utils/math';
import { reverse, easeInQuad } from '@/utils/easing';
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
        return easeInQuad(value);
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
      subscriptions: [],
      reverse: reverse(this.easing)
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
      return this.reverse(this.model.value / this.max);
    },
    rad () {
      return {
        '--rad': this.progress * 2 * Math.PI * this.range
      };
    }
  },

  mounted () {
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
.radial-slider {
  --rad: 0;
  --rotation: 0deg;
  --stroke-width: 5%;
  --handle-size: 20%;
  --translate: calc(var(--handle-size) / 2 - var(--stroke-width) / 2);
  --size: calc(100% - var(--handle-size) + var(--stroke-width));

  display: inline-block;
  width: 100%;
  overflow: hidden;
  transform: rotate(var(--rotation));

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
      stroke-linecap: round;
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
    display: inline-block;
    width: 100%;
    height: 100%;
    transform: rotate(calc(var(--rad) * 1rad)) translateX(var(--translate));

    & .knob {
      position: relative;
      top: 50%;
      display: inline-block;
      width: var(--handle-size);
      height: var(--handle-size);
      margin-left: calc(var(--stroke-width) / 2);
      border: 5px solid white;
      border-radius: 50%;
      box-shadow: inset 0 0 5px black;
      transform: translate(-50%, -50%);
    }
  }

  & .numeric-input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(calc(var(--rotation) * -1));
  }
}

.transition-active .handle {
  transition-duration: 350ms;
  transition-property: transform;
}
</style>

