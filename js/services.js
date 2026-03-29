(function () {

  // check if we are in main folder
  let isRoot = window.location.pathname.indexOf('/pages/') === -1;
  let basePath = "";
  if (isRoot === false) {
    basePath = "../";
  }

  // load services html
  fetch(basePath + 'pages/services.html')
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' — could not load services component');
      return res.text();
    })
    .then(html => {
      const placeholder = document.getElementById('services-placeholder');
      if (!placeholder) return;
      placeholder.innerHTML = html;

      // wait for cards
      const firstCard = placeholder.querySelector('.service-card');
      if (!firstCard) return;

      let attempts = 0;
      function attemptInit() {
        const firstCard = placeholder.querySelector('.service-card');
        if (!firstCard) return;

        if (firstCard.offsetWidth > 0) {
          initCarousel();
        } else if (attempts < 50) {
          attempts++;
          setTimeout(attemptInit, 50);
        } else {
          initCarousel();
        }
      }
      attemptInit();
    })
    .catch(err => console.error('[services.js]', err));


  // start carousel
  function initCarousel() {
    const track = document.querySelector('#carouselTrack') || document.querySelector('.carousel-track');
    if (!track) return;

    const wrapper = track.parentElement;
    const dotsWrap = wrapper.parentElement.querySelector('.carousel-dots') || document.querySelector('#carouselDots');
    const arrowL = wrapper.querySelector('.arrow-left') || document.querySelector('#arrowLeft');
    const arrowR = wrapper.querySelector('.arrow-right') || document.querySelector('#arrowRight');

    // original cards
    const originals = Array.from(track.querySelectorAll('.service-card'));
    const TOTAL = originals.length;

    // make dots
    let dots = [];
    let activeDotsWrap = dotsWrap;

    if (!activeDotsWrap) {
      activeDotsWrap = document.createElement('div');
      activeDotsWrap.className = 'carousel-dots';
      activeDotsWrap.id = 'carouselDots';
      wrapper.parentElement.appendChild(activeDotsWrap);
    }

    activeDotsWrap.innerHTML = '';
    dots = originals.map(() => {
      const b = document.createElement('button');
      b.className = 'dot';
      activeDotsWrap.appendChild(b);
      return b;
    });

    // clone for infinite scroll
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
    for (let i = TOTAL - 1; i >= 0; i--) {
      const clone = originals[i].cloneNode(true);
      clone.classList.add('clone');
      track.insertBefore(clone, track.firstChild);
    }

    const all = Array.from(track.querySelectorAll('.service-card'));

    let cur = TOTAL;
    let animating = false;
    let timer = null;

    // get card width
    function step() {
      const c = all[TOTAL];
      const ml = parseFloat(getComputedStyle(c).marginLeft) || 20;
      const mr = parseFloat(getComputedStyle(c).marginRight) || 20;
      return c.offsetWidth + ml + mr;
    }

    // center card
    function offsetFor(i) {
      const ml = parseFloat(getComputedStyle(all[i]).marginLeft) || 20;
      return i * step() + ml - (wrapper.offsetWidth / 2 - all[i].offsetWidth / 2);
    }

    // update dots
    function syncUI() {
      all.forEach((c, i) => {
        const isMirrorActive = (i % TOTAL) === (cur % TOTAL);
        c.classList.toggle('active', isMirrorActive);
      });
      const ri = cur % TOTAL;
      if (dots && dots.length > 0) {
        dots.forEach((d, i) => d.classList.toggle('active', i === ri));
      }
    }

    // slide
    function slideTo(i, animate) {
      track.style.transition = animate
        ? 'transform 0.5s ease-in-out'
        : 'none';
      track.style.transform = `translateX(-${offsetFor(i)}px)`;
      cur = i;
      syncUI();
      if (animate) animating = true;
    }

    // jump back when needed
    track.addEventListener('transitionend', () => {
      animating = false;
      if (cur < TOTAL) {
        slideTo(cur + TOTAL, false);
      }
      if (cur >= TOTAL * 2) {
        slideTo(cur - TOTAL, false);
      }
    });

    // auto play
    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (!animating) { slideTo(cur + 1, true); }
      }, 12000);
    }

    // arrows
    if (arrowL) {
      arrowL.addEventListener('click', () => {
        if (animating) return;
        startTimer(); slideTo(cur - 1, true);
      });
    }
    if (arrowR) {
      arrowR.addEventListener('click', () => {
        if (animating) return;
        startTimer(); slideTo(cur + 1, true);
      });
    }

    // dots
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        if (animating) return;
        startTimer(); slideTo(TOTAL + i, true);
      });
    });

    // on resize
    window.addEventListener('resize', () => slideTo(cur, false));

    // start
    slideTo(TOTAL, false);
    startTimer();

  }

})();