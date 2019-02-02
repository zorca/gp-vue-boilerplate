
import axios from 'axios';
import cheerio from 'cheerio';

self.addEventListener('message', (event) => {
  axios.get('http://localhost:8050/' + event.data.url, {}).then(result => {
    return result.data;
  }).then((result) => {
    return getNodesFromHTMLStringBySelector(
      result.Content,
      'div[onclick]'
    );
  }).then((result) => {
    self.postMessage(result);
  });
});

function getNodesFromHTMLStringBySelector (result, selector) {
  return [...Array.from(cheerio.load(result)(selector).map((index, item) => {
    return collectPreviewConfig(cheerio.load(item));
  }))];
}

function collectPreviewConfig (item) {
  return {
    title: item('.Headlne > a').attr('title'),
    description: item('.Descriptor').text(),
    preview: `https://www.kinos.to${item('.Thumb > img').attr('src')}`,
    url: item('.Headlne > a').attr('href'),
    lang: `https://www.kinos.to${item('.Genre > div:first-child > img').attr('src')}`,
    imdb: item('.Genre > div:nth-of-type(3)').text().match(/([.\d]+?[\s/]+\d+)$/)[0]
  };
}
