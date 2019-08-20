<template>
  <div
    class="animate"
    :style="'--size: ' + size"
  />
</template>

<script>
import { subscribeToViewport } from '@/service/viewport';

export default {

  data () {
    return {
      size: '100vh'
    };
  },

  mounted () {

    setTimeout(() => {
      global.document.documentElement.classList.add('freeze');
      this.$el.classList.remove('animate');
    }, 3000);

    subscribeToViewport((e) => {
      const result = Math.sqrt(e.x * e.x + e.y * e.y);
      this.size = `${result}px`;
    });
  }
};
</script>

<style lang="postcss" scoped>
div {
  position: fixed;
  top: 50vh;
  left: 50vw;
  width: var(--size);
  height: var(--size);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition-timing-function: ease-in;
  transition-duration: 350ms;
  transition-property: transform;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: 50%;

  &.animate {
    transform: translate(-50%, -50%) scale(0);
  }
}
</style>
