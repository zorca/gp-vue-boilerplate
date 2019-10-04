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
    <!-- <qr-code /> -->
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
    // QrCode: () => import('@/components/molecules/QrCode.vue'),
    TestForm: () => import('@/components/organisms/TestForm')
  },

  head () {
    return {
      title: 'title of page'
    };
  }
};
</script>
