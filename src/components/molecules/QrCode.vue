<template>
  <atom-link
    :to="$attrs.value"
    class="qrcode"
  >
    ddd
  </atom-link>
</template>

<script>
import AtomLink from '@/components/atoms/Link';
import { qrcode } from 'pure-svg-code';

export default {
  components: {
    AtomLink
  },

  mounted () {
    const svgString = qrcode({
      content: 'http://github.com/',
      padding: 4,
      width: 256,
      height: 256,
      color: '#000000',
      background: '#ffffff',
      ecl: 'M'
    });
    console.log(svgString);

    var template = document.createElement('template');
    template.innerHTML = svgString;
    console.log(template.content.childNodes);
  }
};
</script>

<style lang="postcss" scoped>
.qrcode {
  display: block;

  & canvas {
    display: block;
  }
}
</style>
