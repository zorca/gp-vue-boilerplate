<template>
  <a
    :href="url"
    @click="onClick">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <img
      :src="img"
      class="poster">
    <img
      :src="lang"
      class="lang">
    <span>{{ imdb }}</span>
  </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: ''
    },
    imdb: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClick(e) {
      e.preventDefault();
      this.$emit('open', this.url);
    }
  }
};
</script>

<style lang="postcss" scoped>
a {
  position: relative;
  display: inline-block;

  & h3 {
    position: absolute;
    top: 0;
  }

  & p {
    position: absolute;
    bottom: 0;
    display: none;
    height: 3em;
    overflow: hidden;
  }

  & .poster {
    display: block;
  }

  & .lang {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  & span {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
