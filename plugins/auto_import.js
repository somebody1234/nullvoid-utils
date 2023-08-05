import { importModule, importStyle } from '../_import.js';

const root = `${import.meta.url}/../..`;

let theme = 'theme' in document.body.dataset ? document.body.dataset.theme : document.querySelector('meta[name=nv-theme]')?.content;

if (theme) {
  importStyle(`${root}/base.css`);
  importStyle(`${root}/themes/${theme}.css`);
}

const tags = Array.from(document.getElementsByTagName('*')).reduce((p, c) => { if (c.tagName.startsWith('NV-')) { p.add(c.tagName.slice(3).toLowerCase()); } return p; }, new Set());
for (const tag of tags) {
  if (['fullscreen', 'center', 'back', 'home', 'title', 'alwaysactive', 'define'].includes(tag)) {
    importModule(`${root}/components/${tag}.js`);
  } else if (['hljs', 'rellax'].includes(tag)) {
    importModule(`${root}/tp/${tag}.js`);
  } else {
    importModule(`${root}/${tag}_view.js`);
  }
}
