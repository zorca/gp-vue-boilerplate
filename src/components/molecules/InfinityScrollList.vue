<template>
  <ul>
    <iframe
      ref="iframe"
      sandbox="allow-scripts"/>
    <list-item
      v-for="(item, key) in items"
      :key="key"
      :position="key">
      <preview
        :title="item.title"
        :description="item.description"
        :url="item.url"
        :img="item.preview"
        :lang="item.lang"
        :imdb="item.imdb"
        @open="onOpen"/>
    </list-item>
  </ul>
</template>

<script>
import ListItem from '@/components/molecules/ListItem';
import Preview from '@/components/atoms/Preview';
import { generateStream } from '@/utils/streamGenerator';

export default {
  components: {
    ListItem,
    Preview
  },

  data() {
    return {
      items: []
    };
  },

  mounted() {

    // this.getMovies().then((movies) => {
    //   console.log(movies);
    //   this.items = movies;
    // });
    this.getMoviesByGenre();
  },

  methods: {
    onOpen(value) {
      this.getVideoUrls(value)
        .then((urls) => {
          this.$refs.iframe.src = urls[0][0];
          console.log(urls);
        });
    },

    reposition() {
      // console.log(item.position);
    },

    getMovies() {
      return this.$axios.$get('movies/', {})
        .then((result) => {
          let items = [...createHTMLFragment(result).querySelectorAll('#dontbeevil > menu + div > div[onclick]')];
          return items.map((item) => this.collectPreviewConfig(item));
        });
    },

    async getMoviesByGenre() {
      // https://www.kinos.to/aGET/List/?sEcho=2&iColumns=7&sColumns=&iDisplayStart=0&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"B"}
      // https://www.kinos.to/aGET/List/?sEcho=3&iColumns=7&sColumns=&iDisplayStart=25&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"B"}
      //
      // return this.$axios.$get('list/?sEcho=2&iColumns=7&sColumns=&iDisplayStart=0&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"B"}')
      //   .then((result) => {
      //     console.log(result);
      //   });

      const iterator = generateStream((iDisplayStart) => {
        let url = `list/?sEcho=2&iColumns=7&sColumns=&iDisplayStart=${iDisplayStart * 25}&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"Q"}`;
        return this.$axios.$get(url)
          .then((result) => {
            return result.aaData;
          });
      });

      for await (const data of iterator) {
        console.log(data);
      }
      console.log('TEST1', iterator.next().then((result) => { console.log(result); }));
      // console.log('TEST2', iterator.next().then((result) => { console.log(result); }));
      // console.log('TEST3', iterator.next().then((result) => { console.log(result); }));

    },

    collectPreviewConfig(item) {
      return {
        title: item.querySelector('.Headlne > a').attributes.title.value,
        description: item.querySelector('.Descriptor').innerText,
        preview: `https://www.kinos.to${item.querySelector('.Thumb > img').dataset.src}`,
        url: item.querySelector('.Headlne > a').dataset.href,
        lang: `https://www.kinos.to${item.querySelector('.Genre > div:first-child > img').dataset.src}`,
        imdb: item.querySelector('.Genre > div:nth-of-type(3)').innerText.match(/([.\d]+?[\s/]+\d+)$/)[0]
      };
    },

    getVideoUrls(url) {
      return this.getHoster(url)
        .then((hoster) => this.getStreamsByHoster(hoster));
    },

    getHoster(url) {
      return this.$axios.$get(url, {}).then((result) => {
        return [...createHTMLFragment(result).querySelectorAll('ul#HosterList li')];
      });
    },

    getStreamsByHoster(hoster) {
      return Promise.all(hoster.map((host) => {
        let defaultMirrorUrl = host.attributes.rel.value.replace(/&Mirror=\d+$/, '');
        return this.getMirrorStreams(defaultMirrorUrl, this.getMaxMirrorsByHost(host));
      }));
    },

    getMaxMirrorsByHost(host) {
      return host.querySelector('div.Data').outerText.match(/\d+\/(?<max>\d)+/).groups.max;
    },

    getMirrorStreams(defaultUrl, max) {
      return Promise.all(new Array(Number(max)).fill({}).map((value, index) => {
        return this.getStream(`${defaultUrl}&Mirror=${index}`);
      }));
    },

    getStream(url) {
      return this.$axios.$get(`mirror/${url}`, {})
        .then((result) => {
          return result.Stream.match(/src\s*=\s*"(?<url>.+?)"/).groups.url;
        });
    }
  }
};

function createHTMLFragment(html) {
  return document.createRange().createContextualFragment(cleanHTML(html));
}

function cleanHTML(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/ig, '').replace(/(src|href)=/ig, 'data-$1=');
}
</script>

<style lang="postcss">
ul {
  position: relative;
}
</style>
