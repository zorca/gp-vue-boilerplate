<template>
  <vue-link v-bind="$attrs">
    <slot />
  </vue-link>
</template>

<script>
import VueLink from 'vue-link';

export default {
  components: {
    VueLink
  }
};
</script>

<style lang="postcss" scoped>
</style>
