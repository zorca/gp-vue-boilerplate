<i18n>
{
  "en": {
    "test": "message23",
    "hello": "hello world!"
  },
  "de": {
    "test": "nachricht 123",
    "hello": "hallo welt"
  }
}
</i18n>

<template>
  <div>
    <headline :content="$t('test')"/>
    hello2 huhu234 {{ $t('configxyz') }}
    {{ $t('test') }}
    <br>
    <infinity-scroll-list/>
  </div>
</template>

<script>
import Headline from '~/components/atoms/Headline';
import InfinityScrollList from '@/components/molecules/InfinityScrollList';

export default {
  nuxtI18n: {
    paths: {
      en: '/sub/projects',
      de: '/unter/projects'
    }
  },
  components: {
    Headline,
    InfinityScrollList
  },

  head () {
    return {
      title: 'title of page'
    };
  }
};
</script>
