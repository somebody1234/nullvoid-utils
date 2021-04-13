import { importModule, importStyle } from '../_import.js';

let theme = 'theme' in document.body.dataset ? document.body.dataset.theme : document.querySelector('meta[name=nv-theme]')?.content;

if (theme) {
  importStyle('https://u.nullv0.id/base.css');
  importStyle(`https://u.nullv0.id/themes/${theme}.css`);
}

const tags = Array.from(document.getElementsByTagName('*')).reduce((p, c) => { if (c.tagName.startsWith('NV-')) { p.add(c.tagName.slice(3).toLowerCase()); } return p; }, new Set());
for (const tag of tags) {
  if (['fullscreen', 'center', 'back', 'home', 'title', 'alwaysactive', 'define'].includes(tag)) {
    importModule(`https://u.nullv0.id/components/${tag}.js`);
  } else if (['hljs', 'rellax'].includes(tag)) {
    importModule(`https://u.nullv0.id/tp/${tag}.js`);
  } else {
    importModule(`https://u.nullv0.id/${tag}_view.js`);
  }
}
