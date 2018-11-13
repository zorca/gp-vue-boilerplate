<template>
  <intersect
    root-margin="10% 0px 10% 0px"
    @enter="enter"
    @leave="leave"
    @passing="passing">
    <li :style="transform">
      <slot/>
    </li>
  </intersect>
</template>

<script>
export default {
  props: {
    position: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      transform: 'transform: translate(0,0)'
    };
  },

  watch: {
    position: {
      handler(value) {
        this.transform = `transform: translate(0, ${value * 3}em);`;
      },
      immediate: true
    }
  },

  mounted() {
    // console.log(this.$el.getBoundingClientRect());
  },

  methods: {
    enter() {
      // console.log('ENTER');
    },
    leave() {
      this.$emit('leave', this);
      // console.log('LEAVE');
    },
    passing() {
      // console.log('PASSING', value);
    }
  }
};
</script>

<style lang="postcss" scoped>
li {
  /* position: absolute;
  height: 3em; */
}
</style>
