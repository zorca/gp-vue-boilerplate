
<script>
import { ipoint, IPoint } from '@js-basics/vector';

export default {
  abstract: true,
  props: {
    observable: {
      type: Object,
      default () {
        return null;
      }
    },
    index: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    max: {
      type: IPoint,
      default () {
        return ipoint(1, 1);
      }
    }
  },

  watch: {
    observable: {
      handler () {
        this.observable.observe(this.$el);
      }
    }
  },

  mounted () {
    if (this.observable) {
      this.observable.observe(this.$el);
    }
  },

  destroyed () {
    if (this.observable) {
      this.observable.unobserve(this.$el);
    }
  },

  render () {
    try {
      const result = ipoint(() => Math.floor(this.index / this.max) * 100 * this.max);

      mergeDeep(this.$slots.default[0].data, {
        attrs: {
          style: `--x: ${result.x}%; --y: ${result.y}%`,
          'data-index': JSON.stringify({ x: this.index.x, y: this.index.y })
        }
      });

      return this.$slots.default[0];
    } catch (e) {
      throw new Error(e);
    }
  }
};

function mergeDeep (target, source) {
  const isObject = obj => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key.toString()];
    const sourceValue = source[key.toString()];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key.toString()] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key.toString()] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key.toString()] = sourceValue;
    }
  });

  return target;
}
</script>

<style lang="postcss" scoped>
div.item {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 10em;
  box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);
  transform: translateX(var(--x)) translateY(var(--y));

  @nest .scroll-mirror.scroll-vertical & {
    transform: translateX(var(--x)) translateY(var(--y)) rotateZ(180deg);
  }

  @nest .scroll-mirror.scroll-horizontal & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y));
  }

  @nest .scroll-mirror.scroll-vertical.scroll-horizontal & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y)) rotateX(180deg);
  }
}
</style>
