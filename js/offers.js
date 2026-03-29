(function () {
  // check folder path
  const isRoot = !window.location.pathname.includes('/pages/');
  const basePath = isRoot ? '' : '../';

  // load offers html
  fetch(basePath + 'pages/offers.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('offers-placeholder').innerHTML = html;
    })
    .catch(err => console.error('[offers.js]', err));
})();