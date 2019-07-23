<template>
  <molecule-form-numeric
    :label="label"
    :model="model"
    :mask="mask"
    :min="min"
    :max="max"
  >
    hello
  </molecule-form-numeric>
</template>

<script>
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';
export default {
  components: {
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
        return null;
      }
    },
    max: {
      type: Number,
      default () {
        return null;
      }
    },
    mask: {
      type: Object,
      default () {
        return {};
      }
    }
  },
};
</script>

<style>
</style>
