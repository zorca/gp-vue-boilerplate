<template>
  <ul>
    <!-- <iframe
      ref="iframe"
      sandbox="allow-scripts"/> -->
    <preview
      v-for="(item, key) in itemsInit"
      :key="key"
      :title="item.title"
      :description="item.description"
      :url="item.url"
      :img="item.preview"
      :lang="item.lang"
      :imdb="item.imdb"
      :range="range"
      :on-mounted="item.onMounted"
      :offset="offset"
      :position="key"
      class="tile"
      @open="onOpen"/>
  </ul>
</template>

<script>
import Preview from '@/components/atoms/Preview';
import Item from '@/components/molecules/infinityScrollList/Item';
import { getViewport } from '../../service/viewport';
import { getMovieSourceUrls, getMoviesBy } from '@/service/kinox';

export default {
  components: {
    Preview,
    Item
  },

  data() {
    return {
      itemsInit: [],
      items: [],
      range: {
        x: 0,
        y: 0
      },
      offset: {
        x: 2,
        y: 2
      }
    };
  },

  mounted() {
    // getMovies().then((movies) => {
    //   console.log(movies);
    //   this.items = movies;
    // });
    this.getMoviesByGenre();
  },

  methods: {
    onOpen(value) {
      getMovieSourceUrls(value)
        .then((urls) => {
          this.$refs.iframe.src = urls[0][0];
          console.log(urls);
        });
    },

    getMoviesByGenre() {
      // https://www.kinos.to/aGET/List/?sEcho=2&iColumns=7&sColumns=&iDisplayStart=0&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"B"}
      // https://www.kinos.to/aGET/List/?sEcho=3&iColumns=7&sColumns=&iDisplayStart=25&iDisplayLength=25&iSortingCols=1&iSortCol_0=2&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=false&bSortable_4=false&bSortable_5=false&bSortable_6=true&additional={"fType":"movie","Length":60,"fLetter":"B"}

      const iterator = getMoviesBy();
      // for await (const data of iterator) {
      //   console.log(data);
      // }
      iterator.next().then((result) => {
        let item = result.value.slice(0, 1);
        item[0].onMounted = (size) => {
          let viewport = getViewport();
          let numX = Math.ceil(viewport.x / size.x);
          let numY = Math.ceil(viewport.y / size.y);
          let numItems = numX * numY;
          this.itemsInit = result.value.slice(0, numItems + (numX * this.offset.y * 2));
          this.range.x = Math.ceil(this.itemsInit.length / numY);
          this.range.y = Math.ceil(this.itemsInit.length / numX);
        };
        this.itemsInit = item;
      });
      // console.log('TEST2', iterator.next().then((result) => { console.log(result); }));
      // console.log('TEST3', iterator.next().then((result) => { console.log(result); }));

    }
  }
};
</script>

<style lang="postcss">
ul {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
