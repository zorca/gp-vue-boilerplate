<template>
  <div>
    <a
      :href="url"
      @click="onClick"
    >
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <img
        :src="src"
        class="poster"
      >
      <img
        :src="lang"
        class="lang"
      >
      <span>{{ imdb }}</span>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default () {
        return {};
      },
    },
  },

  data () {
    return {
      title: '',
      description: '',
      url: '',
      preview: '',
      lang: '',
      imdb: '',
      src: '',
      image: new Image()
    };
  },

  watch: {
    config: {
      handler (value) {
        this.title = value.title;
        this.description = value.description;
        this.url = value.url;
        this.preview = value.preview;
        this.lang = value.lang;
        this.imdb = value.imdb;
      },
      immediate: true,
    },
    preview: {
      handler (url) {
        this.src = '';
        this.image.src = url;
      }
    }
  },

  mounted () {
    this.image.onload = () => {
      this.src = this.image.src;
    };
  },

  methods: {
    onClick (e) {
      e.preventDefault();
      this.$emit('open', this.url);
    },
  },
};
</script>

<style lang="postcss" scoped>
div {
  margin-top: calc(150 / 105 * 100%);

  & a {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;

    & h3 {
      position: absolute;
      top: 0;
      width: 100%;
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
      width: 100%;
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
}
</style>
