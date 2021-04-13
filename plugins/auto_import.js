import { importModule, importStyle } from '../_import.js';

const domain = new URL(import.meta.url).host;

let theme = 'theme' in document.body.dataset ? document.body.dataset.theme : document.querySelector('meta[name=nv-theme]')?.content;

if (theme) {
  importStyle(`https://${domain}/base.css`);
  importStyle(`https://${domain}/themes/${theme}.css`);
}

const tags = Array.from(document.getElementsByTagName('*')).reduce((p, c) => { if (c.tagName.startsWith('NV-')) { p.add(c.tagName.slice(3).toLowerCase()); } return p; }, new Set());
for (const tag of tags) {
  if (['fullscreen', 'center', 'back', 'home', 'title', 'alwaysactive', 'define'].includes(tag)) {
    importModule(`https://${domain}/components/${tag}.js`);
  } else if (['hljs', 'rellax'].includes(tag)) {
    importModule(`https://${domain}/tp/${tag}.js`);
  } else {
    importModule(`https://${domain}/${tag}_view.js`);
  }
}
