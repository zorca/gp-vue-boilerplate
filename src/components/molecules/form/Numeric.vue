<template>
  <atom-label
    :text="label"
    :message="message"
  >
    <template #input>
      <slot name="before:gui" />
      <vue-numeric
        v-model="model.value"
        :disabled="disabled"
        :min="min"
        :max="max"
        :currency="unit"
        :currency-symbol-position="unitSymbolPosition"
        :separator="separator"
        :precision="precision"
      />
      <slot name="after:gui" />
    </template>
  </atom-label>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';
import VueNumeric from 'vue-numeric';

export default {
  components: {
    AtomLabel,
    VueNumeric
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
    disabled: {
      type: Boolean,
      default () {
        return false;
      }
    },
    min: {
      type: Number,
      default () {
        return undefined;
      }
    },
    max: {
      type: Number,
      default () {
        return undefined;
      }
    },
    unit: {
      type: String,
      default () {
        return 'm';
      }
    },
    suffix: {
      type: Boolean,
      default () {
        return true;
      }
    },
    separator: {
      type: String,
      default () {
        return '.';
      }
    },
    precision: {
      type: Number,
      default () {
        return 2;
      }
    }
  },

  data () {
    return {
      message: ''
    };
  },

  computed: {
    unitSymbolPosition () {
      if (this.suffix) {
        return 'suffix';
      }
      return 'prefix';
    }
  },

  methods: {
    validate (e) {
      if (e.target.validity.valueMissing) {
        this.message = 'value missing';
      } else {
        this.message = '';
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
input {
  width: 100%;
  text-align: right;
}
</style>
