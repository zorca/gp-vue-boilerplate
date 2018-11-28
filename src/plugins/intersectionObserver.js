import Vue from 'vue';
import { subscribeToScroll, getScrollValues } from '../service/scroll';

const observedIntersections = new Map();
const viewport = { x: 0, y: 0 };
const offset = { x: 0, y: 0 };

Vue.component('intersect', {
  abstract: true,

  props: {
    threshold: {
      type: Array,
      required: false,
      default() {
        return buildThresholdList();
      }
    },
    root: {
      type: getHTMLElement(),
      required: false,
      default() {
        return null;
      }
    },
    rootMargin: {
      type: String,
      required: false,
      default() {
        return '0px 0px 0px 0px';
      }
    }
  },

  watch: {
    rootMargin: {
      handler() {
        this.setupIntersectionObserver();
      }
    }
  },

  mounted() {
    this.scrollObserver = subscribeToScroll(e => onScroll.bind(this)(e));
    this.setupIntersectionObserver();
  },

  destroyed() {
    this.destroyObserver();
  },

  methods: {
    setupIntersectionObserver() {
      this.destroyObserver();
      this.intersectionObserver = new IntersectionObserver(
        onIntersect.bind(this),
        {
          threshold: this.threshold,
          root: this.root,
          rootMargin: this.rootMargin
        }
      );
      this.intersectionObserver.observe(this.$el);
    },

    destroyObserver() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
    }
  },

  render() {
    return this.$slots.default ? this.$slots.default[0] : null;
  }
});

function getHTMLElement() {
  if (typeof window === 'undefined') {
    return Object;
  }
  return window.HTMLElement;
}

function buildThresholdList() {
  var thresholds = [];
  var numSteps = 100;

  for (var i = 0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

function onScroll() {
  let bounds = this.$el.getBoundingClientRect();
  observedIntersections.forEach(item => {
    addIntersectionValues(item, bounds);
    this.$emit('passing', item);
  });
}

function onIntersect([entry]) {
  this.entry = entry;
  entry.scroll = getScrollValues();
  entry.intersection = { x: 0, y: 0 };
  addIntersectionValues(entry, this.$el.getBoundingClientRect());
  this.$emit(getIntersectionState(entry), entry);
}

function getIntersectionState(entry) {
  if (!entry.isIntersecting) {
    observedIntersections.delete(entry.target);
    return 'leave';
  }
  observedIntersections.set(entry.target, entry);
  return 'enter';
}

function addIntersectionValues(entry, bounds) {
  viewport.y = entry.rootBounds.height;
  viewport.x = entry.rootBounds.width;
  offset.x = (viewport.x - bounds.width) / 2;
  offset.y = (viewport.y - bounds.height) / 2;
  entry.intersection.x = clamp(
    (bounds.left - offset.x) / (viewport.x - offset.x)
  );
  entry.intersection.y = clamp(
    (bounds.top - offset.y) / (viewport.y - offset.y)
  );
}

function clamp(value, min = -1, max = 1) {
  return Math.min(Math.max(value, min), max);
}
