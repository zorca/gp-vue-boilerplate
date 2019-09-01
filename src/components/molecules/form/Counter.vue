<template>
  <atom-label
    :text="label"
    :message="message"
  >
    <template #input>
      <button
        type="button"
        @click.prevent="count(-1)"
      >
        -
      </button>
      <vue-numeric
        ref="numeric"
        v-model="model.value"
        :min="min"
        :max="max"
      />
      <button
        type="button"
        @click.prevent="count(1)"
      >
        +
      </button>
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
        return 'COUNTER';
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
        return 10;
      }
    }
  },

  data () {
    return {
      model: {
        value: 0
      },
      message: ''
    };
  },

  methods: {
    count (e) {
      this.$refs.numeric.process(this.model.value + e);
    }
  }
};
</script>

<style lang="postcss" scoped>
button {
  display: inline;
  border: none;
  outline: none;
}
</style>
