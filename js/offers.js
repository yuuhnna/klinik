(function () {
  // check folder path

    const isRoot   = !window.location.pathname.includes('/pages/');
    const basePath = isRoot ? '' : '../';

    fetch(basePath + 'pages/offers.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('offers-placeholder').innerHTML = html;
    });

  // load offers html
})();