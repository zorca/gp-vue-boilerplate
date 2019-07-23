<template>
  <atom-label
    :text="label"
    :message="message"
  >
    <template #input>
      <atom-input
        v-mask-numeric="mask"
        :min="mask.min"
        :max="mask.max"
        :model="model"
        :validate="validate"
      />
      <slot name="gui" />
    </template>
  </atom-label>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';
import AtomInput from '@/components/atoms/Input';
import numericMask from '@/utils/inputmask/numericMask';
import Vue from 'vue';

Vue.directive('mask-numeric', {
  bind: function (el, binding) {
    if (numericMask) {
      numericMask(binding.value).mask(el);
    }
  }
});

export default {
  components: {
    AtomLabel,
    AtomInput
  },

  props: {
    label: {
      type: String,
      default () {
        return 'Checkbox';
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

  data () {
    return {
      message: ''
    };
  },

  methods: {
    validate (e) {
      console.log('AHA');
      if (e.target.validity.valueMissing) {
        this.message = 'value missing';
      } else {
        this.message = '';
      }
    }
  }
};
</script>

<style lang="postcss">
</style>
