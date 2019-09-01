<template>
  <transition-group name="list">
    <div
      v-for="item in items"
      :key="item.key"
      :style="`top: ${item.pos.y}px; left: ${item.pos.x}px`"
    />
  </transition-group>
</template>

<script>
import { fromEvent } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';
import { getScrollPos } from '@/service/scroll';
import { Victor } from '@js-basics/vector';
import uuid from 'uuid/v1';

export default {
  props: {
    whitelist: {
      type: Set,
      default () {
        return new Set([
          'input',
          'label',
          'select',
          'a'
        ]);
      }
    },

    blacklist: {
      type: Set,
      default () {
        return new Set([]);
      }
    }
  },

  data () {
    return {
      items: []
    };
  },

  mounted () {
    const options = { passive: true, capture: false };
    const pointerUpObserver = fromEvent(global.document, 'pointerup', options);
    this.subscriberPointerDown = fromEvent(global.document, 'pointerdown', options)
      .pipe(
        filter((e) => isValidElement(e.path, this.whitelist, this.blacklist)),
        map((e) => new Victor(e.x, e.y))
      )
      .subscribe((pos) => {
        const scrollPos = getScrollPos();
        const item = this.items.push({ pos: new Victor(() => pos + scrollPos), key: uuid() });

        pointerUpObserver.pipe(take(1)).subscribe(() => {
          this.items.splice(item - 1, 1);
        });
      });
  },

  destroyed () {
    this.subscriberPointerDown.unsubscribe();
  }
};

function isValidElement (path, whitelist, blacklist) {
  const node = path.shift();
  if (path.length === 0 || !node.tagName || blacklist.has(node.tagName.toLowerCase())) {
    return false;
  }
  if (whitelist.has(node.tagName.toLowerCase())) {
    return true;
  } else {
    return isValidElement(path, whitelist, blacklist);
  }
}
</script>

<style lang="postcss" scoped>
span > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  pointer-events: none;
  background: rgba(255, 0, 0, 0.5);
  border-radius: 50%;
  transition-timing-function: easeOutQuint;
  transition-property: opacity transform;
  transform: translate(-50%, -50%);

  &.list-enter-active {
    transition-duration: 0ms;
  }

  &.list-leave-active {
    transition-duration: 350ms;
  }

  &.list-enter,
  &.list-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(4);
  }
}
</style>
