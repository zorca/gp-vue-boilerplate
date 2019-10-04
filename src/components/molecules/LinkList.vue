<template>
  <ul>
    <li
      v-for="(item) in list"
      :key="item.title"
    >
      <atom-link :to="localePath(item.url)">
        {{ item.title }}
      </atom-link>
    </li>
  </ul>
</template>

<script>
import AtomLink from '@/components/atoms/Link';

export default {
  components: {
    AtomLink
  },

  props: {
    list: {
      type: Array,
      required: true,
      default: function () {
        return [];
      }
    }
  },
};
</script>

<style module>
:global(a.nuxt-link-active) {
  color: green;
}

a {
  line-height: 2em;
  color: black;
}
</style>
