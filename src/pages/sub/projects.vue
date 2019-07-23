<i18n>
{
  "en": {

  },
  "de": {

  }
}
</i18n>

<template>
  <div>
    <test-form />
  </div>
</template>

<script>
export default {
  nuxtI18n: {
    paths: {
      en: '/sub/projects',
      de: '/unter/projects'
    }
  },

  components: {
    TestForm: () => import('@/components/organisms/TestForm')
  },

  head () {
    return {
      title: 'title of page'
    };
  }
};
</script>
