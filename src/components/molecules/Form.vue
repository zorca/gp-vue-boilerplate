<template>
  <form @submit="checkForm">
    <slot />
    <button type="submit">
      SUBMIT
    </button>
  </form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    }
  },

  methods: {
    checkForm (e) {
      e.preventDefault();
      // console.log(this.data);
    }
  }
};
</script>

<style lang="postcss">
</style>
