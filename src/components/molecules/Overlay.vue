<template>
  <div>
    <atom-connector
      :start="{x: 100, y: 100}"
      :end="{x: 400, y: 200}"
    />
    <transition
      appear
      name="list"
    >
      <div
        class="container"
        :style="cssProps"
      >
        <div class="inner-container">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { subscribeToViewport } from '@/service/viewport';
import AtomConnector from '@/components/atoms/Connector';

export default {
  components: {
    AtomConnector
  },

  props: {
    start: {
      type: Object,
      default () {
        return null;
      }
    },
    end: {
      type: Object,
      default () {
        return null;
      }
    }
  },

  data () {
    return {
      size: '100vh',
      innerWidth: '100vw',
      innerHeight: '100vh'
    };
  },

  computed: {
    cssProps () {
      return {
        '--size': this.size,
        '--inner-width': this.innerWidth,
        '--inner-height': this.innerHeight
      };
    }
  },

  mounted () {
    global.document.documentElement.classList.add('freeze');

    subscribeToViewport((e) => {
      const result = Math.sqrt(e.x * e.x + e.y * e.y);
      this.size = `${result}px`;
      this.innerWidth = `${e.x}px`;
      this.innerHeight = `${e.y}px`;
    });
  },

  methods: {
    onShow () {
      console.log('e');
    }
  }
};
</script>

<style lang="postcss" scoped>
div.container {
  position: fixed;
  top: 50vh;
  left: 50vw;
  z-index: 1000;
  width: var(--size);
  height: var(--size);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition-timing-function: ease-in;
  transition-property: transform;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: 50%;

  & div.inner-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: var(--inner-width);
    height: var(--inner-height);
    margin: auto;
  }

  &.list-enter-active {
    transition-duration: 350ms;
  }

  &.list-leave-active {
    transition-duration: 350ms;
  }

  &.list-enter,
  &.list-leave-to {
    transform: translate(-50%, -50%) scale(0);
  }
}
</style>
