(function () {
  const isRoot   = !window.location.pathname.includes('/pages/');
  // // check folder path
  const basePath = isRoot ? '' : '../';

  // load footer html
  const cacheBuster = '?t=' + new Date().getTime();
  fetch(basePath + 'pages/footer.html' + cacheBuster, { cache: 'no-store' })
    .then(res => res.text())
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Error loading footer:', err));
})();
