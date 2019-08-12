<template>
  <atom-label
    :text="label"
    :message="message"
  >
    <template v-slot:label>
      <slot
        name="label"
        :label="label"
      />
    </template>
    <template v-slot:input>
      <atom-input
        v-mask-text="mask"
        :model="model"
        :validate="validate"
      />
    </template>
    <template v-slot:error>
      <slot
        name="error"
        :message="message"
      />
    </template>
  </atom-label>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';
import AtomInput from '@/components/atoms/Input';
import textMask from '@/utils/inputmask/textMask';
import Vue from 'vue';

Vue.directive('mask-text', {
  bind: function (el, binding) {
    if (textMask) {
      textMask(binding.value).mask(el);
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
        return 'Label Text';
      }
    },
    model: {
      type: Object,
      default () {
        return {};
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
    validate () {
      return true;
    }
  }
};
</script>

<style lang="postcss">
</style>
