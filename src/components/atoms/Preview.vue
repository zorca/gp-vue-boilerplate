<template>
  <intersect
    :threshold="[0]"
    :root-margin="margin"
    @enter="enter"
    @leave="leave">
    <li :style="transform">
      <a
        :href="url"
        @click="onClick">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <img
          :src="img"
          class="poster"
          @load="onImageLoad">
        <img
          :src="lang"
          class="lang">
        <span>{{ imdb }}</span>
      </a>
    </li>
  </intersect>
</template>

<script>

import { subscribeOnce } from '../../service/animationFrame';
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
    },
    onMounted: {
      type: Function,
      default() { }
    },
    offset: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    },
    range: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },

  data() {
    return {
      transform: getTransform(),
      step: { x: 0, y: 0 },
      size: {
        x: 0,
        y: 0
      },
      margin: '0px 0px 0px 0px'
    };
  },

  methods: {
    onImageLoad() {
      let bounds = this.$el.getBoundingClientRect();
      this.size.x = bounds.width;
      this.size.y = bounds.height;
      this.margin = `${this.size.y * this.offset.y}px ${this.size.x * this.offset.x}px`;
      // console.log(this.margin);
      this.updateElement();
      this.onMounted(this.size);

    },

    onClick(e) {
      e.preventDefault();
      this.$emit('open', this.url);
    },

    enter() {
      // console.log('ENTER', e);
    },

    leave(e) {
      this.updateStep(e);
      this.updateElement();
    },

    updateStep(e) {
      if (e.scroll.direction.x > 0) {
        this.step.x++;
      } else if (e.scroll.direction.y > 0) {
        this.step.y++;
      } else if (e.scroll.direction.x < 0 && this.step.x > 0) {
        this.step.x--;
      } else if (e.scroll.direction.y < 0 && this.step.y > 0) {
        this.step.y--;
      }
    },

    updateElement() {
      let x = this.range.x * this.size.x * this.step.x;
      let y = this.range.y * this.size.y * this.step.y;
      subscribeOnce(() => {
        this.$el.style.transform = getTransform(x, y);
      });
    }
  }
};

function getTransform(x = 0, y = 0) {
  return `translate(${x}px, ${y}px)`;
}
</script>

<style lang="postcss" scoped>
/* li {
  position: absolute;
} */
li {
  display: block;
  float: left;
}

a {
  position: relative;
  display: block;
  height: 200px;

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
    height: 100%;
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
