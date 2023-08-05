import { importModule } from '../_import.js';

importModule(`${import.meta.url}/../auto_import.js`);
if (!document.querySelector('noscript')) { console.warn('no <noscript> tag on page!'); }
