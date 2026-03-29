(function () {
  // // check folder path
  const isRoot = !window.location.pathname.includes('/pages/');
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
