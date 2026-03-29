(function () {
  // check folder path
  const isRoot   = !window.location.pathname.includes('/pages/');
  const basePath = isRoot ? '' : '../';

  // load about html
  fetch(basePath + 'pages/about.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('about-placeholder').innerHTML = html;
    })
    .catch(err => console.error('[about.js]', err));
})();