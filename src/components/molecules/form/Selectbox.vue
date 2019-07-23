<template>
  <atom-label :text="label">
    <template #input>
      <select
        v-model="model.value"
        :name="model.name"
      >
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>
  </atom-label>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';

export default {
  components: {
    AtomLabel
  },

  props: {
    label: {
      type: String,
      default () {
        return 'selectbox';
      }
    },
    model: {
      type: Object,
      default () {
        return [];
      }
    },
    options: {
      type: Array,
      default () {
        return [];
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
input {
  display: none;
}

.menu {
  display: inline-block;
}

.close {
  display: none;
}

input:checked + .menu {
  display: none;
}

input:checked + .menu + .close {
  display: inline-block;
}
</style>
