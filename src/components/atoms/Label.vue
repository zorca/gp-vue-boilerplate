<template>
  <label>
    <slot name="label">
      <span>{{ text }}</span>
    </slot>
    <slot name="input" />
    <slot name="error">
      <span class="error">{{ message }}</span>
    </slot>
  </label>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default () {
        return '';
      }
    },
    message: {
      type: String,
      default () {
        return '';
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
</style>
