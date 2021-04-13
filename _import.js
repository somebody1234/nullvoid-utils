const scriptsImported = new Set();
const modulesImported = new Set();
const stylesImported = new Set();

export function importScript(url) {
  if (scriptsImported.has(url)) { return; }
  scriptsImported.add(url);
  const el = document.createElement('script');
  el.src = url;
  document.head.appendChild(el);
}

export function importModule(url) {
  if (modulesImported.has(url)) { return; }
  modulesImported.add(url);
  const el = document.createElement('script');
  el.type = 'module';
  el.src = url;
  document.head.appendChild(el);
}

export function importStyle(url) {
  if (stylesImported.has(url)) { return; }
  stylesImported.add(url);
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = url;
  document.head.insertBefore(el, document.head.firstChild);
}
