<template>
  <canvas/>
</template>

<script>
import axios from 'axios';
import DepthReader from '../../service/DepthReader';

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  mounted() {
    loadImage(this.src).then((e) => {
      console.log('AHA', e.data);
      let reader = new DepthReader();
      reader.parseFile(e.data);
      console.log(reader);

    });

  }
};

function loadImage(url) {
  return axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'Accept': 'image/jpeg'
    }
  });
  // return new Promise((resolve, reject) => {
  //   let img = new Image();
  //   img.src = url;
  //   img.onload = function () {
  //     resolve(img);
  //   };
  //   img.onerror = reject;
  // });
}

// function blobToDataURL(blob) {
//   return new Promise((resolve) => {
//     var a = new FileReader();
//     a.onload = function (e) { resolve(e.target.result); };
//     a.readAsDataURL(blob);
//   });

// }
</script>

<style scoped>
img {
  width: 100%;
}
</style>
