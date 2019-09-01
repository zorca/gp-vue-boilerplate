<template>
  <div class="radial-slider-overlay">
    <molecule-overlay v-if="show">
      <molecule-form-radial-slider :model="model" />
    </molecule-overlay>
    <molecule-form-numeric
      :model="model"
      @click.native="onClick"
    />
  </div>
</template>

<script>
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
      show: false
    };
  },

  mounted () {
    // setTimeout(() => {
    //   this.show = true;
    // }, 3000);
    // setTimeout(() => {
    //   this.show = false;
    // }, 6000);
  },

  methods: {
    onClick (e) {
      console.log('AHA', e);
      this.show = true;
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
