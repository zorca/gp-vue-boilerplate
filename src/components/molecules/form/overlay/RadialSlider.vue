<template>
  <div class="radial-slider-overlay">
    <molecule-overlay
      v-if="start"
      :start="start"
      @close="start = null"
    >
      <molecule-form-radial-slider :model="model" />
    </molecule-overlay>
    <molecule-form-numeric
      :model="model"
      disabled
      @click.native="onClick"
    />
  </div>
</template>

<script>
import { Point } from '@js-basics/vector';
import MoleculeOverlay from '@/components/molecules/Overlay';
import MoleculeFormRadialSlider from '@/components/molecules/form/RadialSlider';
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';

export default {
  components: {
    MoleculeOverlay,
    MoleculeFormRadialSlider,
    MoleculeFormNumeric
  },

  props: {
    model: {
      type: Object,
      default () {
        return {};
      }
    }
  },

  data () {
    return {
      start: null
    };
  },

  methods: {
    onClick (e) {
      this.start = new Point(e.x, e.y);
    }
  }
};
</script>

<style lang="postcss" scoped>
.connector {
  position: absolute;
}

/* .radial-slider-overlay >>> .radial-slider {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
} */
</style>
