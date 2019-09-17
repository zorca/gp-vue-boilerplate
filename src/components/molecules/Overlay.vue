<template>
  <div>
    <atom-connector
      :start="start"
      :end="screenCenter"
      @end="showOverlay=true"
    />
    <transition
      appear
      name="open"
      @after-enter="showContent=true;"
    >
      <div
        v-if="showOverlay"
        class="container"
        :style="cssProps"
      >
        <transition
          appear
          name="content"
        >
          <div
            v-if="showContent"
            class="inner-container"
          >
            <slot />
            <div
              class="close"
              @click="$emit('close')"
            >
              close
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { Point } from '@js-basics/vector';
import { getSize, subscribeToViewport } from '@/service/viewport';
import AtomConnector from '@/components/atoms/Connector';

export default {
  components: {
    AtomConnector
  },

  props: {
    start: {
      type: Point,
      default () {
        return null;
      }
    }
  },

  data () {
    return {
      size: `${Math.round(getSize().length / 2) * 2}px`,
      screenCenter: getSize().calc(v => v / 2),
      showOverlay: false,
      showContent: false,
      subscription: null
    };
  },

  computed: {
    cssProps () {
      return {
        '--size': this.size
      };
    }
  },

  mounted () {
    global.document.documentElement.classList.add('freeze');
    this.subscription = subscribeToViewport((e) => {
      this.size = `${Math.round(e.length / 2) * 2}px`;
      this.screenCenter = e.calc((v) => v / 2);
    });
  },

  destroyed () {
    global.document.documentElement.classList.remove('freeze');
    this.subscription.unsubscribe();
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
  backdrop-filter: blur(10px);

  &.open-enter-active {
    transition-duration: 350ms;
  }

  &.open-leave-active {
    transition-duration: 350ms;
  }

  &.open-enter,
  &.open-leave-to {
    transform: translate(-50%, -50%) scale(0);
  }

  & div.inner-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: auto;
    opacity: 1;
    transition-timing-function: ease-in;
    transition-property: opacity;

    &.content-enter-active {
      transition-duration: 350ms;
    }

    &.content-enter,
    &.content-leave-to {
      opacity: 0;
    }

    & .close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
