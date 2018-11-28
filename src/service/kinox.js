import axios from 'axios';
import { generateStream } from '@/utils/streamGenerator';

export function getMovies() {
  return doGetRequest('movies/', {}).then(result => {
    return getNodesFromHTMLStringBySelector(
      result,
      '#dontbeevil > menu + div > div[onclick]'
    ).map(item => collectPreviewConfig(item));
  });
}

export function getMoviesBy() {
  return generateStream(iDisplayStart => {
    let num = 100;
    let url = `list/?iDisplayStart=0&iDisplayLength=10&Page=${iDisplayStart}&Per_Page=${num}&per_page=${num}&ListMode=cover&additional={"fType":"movie","Length":${num},"fLetter":"A"}`;
    return doGetRequest(url).then(result => {
      return getNodesFromHTMLStringBySelector(
        result.Content,
        'div[onclick]'
      ).map(item => collectPreviewConfig(item));
    });
  });
}

export function getMovieSourceUrls(url) {
  return getHoster(url).then(hoster => getStreamsByHoster(hoster));
}

function getHoster(url) {
  return doGetRequest(url, {}).then(result => {
    return getNodesFromHTMLStringBySelector(result, 'ul#HosterList li');
  });
}

function getStreamsByHoster(hoster) {
  return Promise.all(
    hoster.map(host => {
      return getMirrorStreams(
        host.attributes.rel.value.replace(/&Mirror=\d+$/, ''),
        getMaxMirrorsByHost(host)
      );
    })
  );
}

function getMaxMirrorsByHost(host) {
  return host.querySelector('div.Data').outerText.match(/\d+\/(\d)+/)[1];
}

function getMirrorStreams(defaultUrl, max) {
  return Promise.all(
    new Array(Number(max)).fill({}).map((value, index) => {
      return getStream(`${defaultUrl}&Mirror=${index}`);
    })
  );
}

function getStream(url) {
  return doGetRequest(`mirror/${url}`, {}).then(result => {
    return result.Stream.match(/src\s*=\s*"(.+?)"/)[1];
  });
}

function doGetRequest(url, options = {}) {
  return axios.get(url, options).then(result => {
    return result.data;
  });
}

function collectPreviewConfig(item) {
  return {
    title: item.querySelector('.Headlne > a').attributes.title.value,
    description: item.querySelector('.Descriptor').innerText,
    preview: `https://www.kinos.to${
      item.querySelector('.Thumb > img').dataset.src
    }`,
    url: item.querySelector('.Headlne > a').dataset.href,
    lang: `https://www.kinos.to${
      item.querySelector('.Genre > div:first-child > img').dataset.src
    }`,
    imdb: item
      .querySelector('.Genre > div:nth-of-type(3)')
      .innerText.match(/([.\d]+?[\s/]+\d+)$/)[0]
  };
}

function getNodesFromHTMLStringBySelector(result, selector) {
  return [...createHTMLFragment(result).querySelectorAll(selector)];
}

function createHTMLFragment(html) {
  return document.createRange().createContextualFragment(cleanHTML(html));
}

function cleanHTML(html) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/(src|href)=/gi, 'data-$1=');
}
