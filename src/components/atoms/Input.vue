<template>
  <input
    v-model="model.value"
    :name="model.name"
    :type="type"
    :value="value"
    :min="min"
    :max="max"
    :required="required"
    @input="check"
  >
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default () {
        return `input-${this._uid}`;
      }
    },
    type: {
      type: String,
      default () {
        return 'text';
      }
    },
    value: {
      type: String,
      default () {
        return null;
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
    model: {
      type: Object,
      default () {
        return {};
      }
    },
    required: {
      type: Boolean,
      default () {
        return false;
      }
    },
    validate: {
      type: Function,
      default () {
        return function () { return true; };
      }
    }
  },

  created () {
    this.model.name = this.model.name || this.name;
  },

  methods: {
    check (e) {
      if (this.validate(e)) {
        this.$emit('input', e.target.value);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
</style>
