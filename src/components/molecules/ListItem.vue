
<script>
import { ipoint, IPoint, point, Point } from '@js-basics/vector';

IPoint.prototype.toCSSVars = function (name = 'ipoint') {
  return {
    [`--${name}-x`]: this.x,
    [`--${name}-y`]: this.y
  };
};

Point.prototype.toCSSVars = function (name = 'point') {
  return {
    [`--${name}-x`]: this.x,
    [`--${name}-y`]: this.y
  };
};

export default {
  abstract: true,
  props: {
    index: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    position: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    offset: {
      type: IPoint,
      default () {
        return ipoint();
      }
    },
    sizeDiff: {
      type: Point,
      default () {
        return point();
      }
    },
    size: {
      type: Point,
      default () {
        return point();
      }
    },
    offsetYGlobal: {
      type: Array,
      default () {
        return [];
      }
    }
  },

  data () {
    return {

    };
  },

  mounted () {
    this.$el.position = this.position;
    this.updateSize();
    this.$emit('mounted', this.$el);
  },

  methods: {
    updateSize () {
      this.size.x = this.$el.querySelector('.content').clientWidth / this.$el.clientWidth;
      this.size.y = this.$el.querySelector('.content').clientHeight / this.$el.clientHeight;
      const diff = ipoint(() => this.size - ipoint(1, 1));
      this.sizeDiff.calc(() => +diff);
      console.log('size', this.size.x, this.size.y, 'size diff', this.sizeDiff.x, this.sizeDiff.y);
    }
  },

  render () {
    try {
      const slot = this.$slots.default[0];
      slot.data.domProps = {
        ...slot.data.domProps,
        index: this.index
      };
      slot.data.style = {
        ...slot.data.style,
        ...this.position.toCSSVars('pos'),
        ...this.offset.toCSSVars('offset')
        // ...this.index.toCSSVars('index')
      };
      return slot;
    } catch (e) {
      throw new Error(e);
    }
  }
};

</script>

<style lang="postcss" scoped>
div.item {
  --x: calc((var(--offset-x)) * 100%);
  --y: calc((var(--offset-y)) * 100%);

  display: flex;
  grid-row-start: calc(var(--pos-y) + 1);
  grid-column-start: calc(var(--pos-x) + 1);
  align-items: flex-start;

  /* align-items: center;
  justify-content: center; */
  width: 300px;
  height: 10em;
  transform: translateX(var(--x)) translateY(var(--y));

  @nest .scroll-mirror.scroll-vertical:not(.scroll-horizontal) & {
    align-items: flex-end;
    transform: translateX(var(--x)) translateY(var(--y)) rotateZ(180deg);
  }

  @nest .scroll-mirror.scroll-horizontal:not(.scroll-vertical) & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y));
  }

  @nest .scroll-mirror.scroll-vertical.scroll-horizontal & {
    transform: translateX(calc(var(--x) * -1)) translateY(var(--y)) rotateX(180deg);
  }

  & >>> .content {
    width: 100%;
    min-height: 100%;
    box-shadow: 0 2px 2px 0 rgba(173, 173, 173, 1);
  }
}
</style>
