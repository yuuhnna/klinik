(function () {

  // check folder path
  const isRoot   = !window.location.pathname.includes('/pages/');
  const basePath = isRoot ? '' : '../';

  // load email script
  const ejsScript = document.createElement('script');
  ejsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  ejsScript.onload = function () {
    emailjs.init('AY7h3fROo-KZdBXe3');
  };
  document.head.appendChild(ejsScript);

  // load contact page html
  fetch(basePath + 'pages/contact.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('contact-placeholder').innerHTML = html;
      initContactScripts();
    })
    .catch(err => console.error('[contact.js]', err));

  // modal function
  function showModal(type, title, message) {
    const overlay = document.getElementById('contact-modal');
    const titleEl = document.getElementById('modal-title');
    const msgEl   = document.getElementById('modal-message');

    if (!overlay) return;

    titleEl.textContent = title;
    msgEl.textContent   = message;

    overlay.classList.add('show');
    overlay.style.display = 'flex';

    // Close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = function () {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
      };
    }

    // Close on backdrop click
    overlay.onclick = function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
      }
    };
  }

  // contact page scripts
  function initContactScripts() {

    // star rating
    const stars       = document.querySelectorAll('#star-rating .star');
    const ratingInput = document.getElementById('rating-value');

    if (stars.length > 0) {
      stars.forEach((star, index) => {
        star.addEventListener('click', () => {
          const clickedValue = index + 1;
          if (parseInt(ratingInput.value) === clickedValue) {
            stars.forEach(s => s.classList.remove('active'));
            ratingInput.value = 0;
          } else {
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i <= index; i++) {
              stars[i].classList.add('active');
            }
            ratingInput.value = clickedValue;
          }
        });

        star.addEventListener('mouseenter', () => {
          stars.forEach(s => s.classList.remove('active'));
        });
      });

      document.getElementById('star-rating').addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value);
        stars.forEach((s, i) => {
          if (i < currentRating) s.classList.add('active');
        });
      });
    }


    // send email
    const form = document.querySelector('.review-form');
    if (form) {

      // phone input: allow numbers only, max 11 digits (real-time filter)
      const phoneInputEl = form.querySelector('.phone-input');
      const phoneError   = document.getElementById('phone-error');

      if (phoneInputEl) {
        phoneInputEl.addEventListener('input', () => {
          // Allow only digits, max 11
          phoneInputEl.value = phoneInputEl.value.replace(/\D/g, '').slice(0, 11);

          // Clear error state as user types
          if (phoneInputEl.classList.contains('invalid')) {
            phoneInputEl.classList.remove('invalid');
            if (phoneError) {
              phoneError.textContent = '';
              phoneError.classList.remove('show');
            }
          }
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput    = form.querySelector('input[placeholder="YOUR NAME"]');
        const emailInput   = form.querySelector('input[placeholder="EMAIL ADDRESS"]');
        const phoneInput   = form.querySelector('.phone-input');
        const messageInput = form.querySelector('textarea[placeholder="MESSAGE"]');

        const nameVal    = nameInput.value.trim();
        const emailVal   = emailInput.value.trim();
        const phoneVal   = phoneInput.value.trim();
        const messageVal = messageInput.value.trim();
        const ratingVal  = ratingInput ? ratingInput.value : '0';

        // check if empty
        if (!nameVal || !emailVal || !phoneVal || !messageVal) {
          showModal('error', 'Incomplete Form', 'Please fill in all fields before submitting.');
          return;
        }

        // check phone number
        if (!/^09\d{9}$/.test(phoneVal)) {
          if (phoneError) {
            phoneError.textContent = 'Use 11 digits starting with 09';
            phoneError.classList.add('show');
          }
          phoneInput.classList.add('invalid');
          phoneInput.focus();
          return;
        }

        // Disable button while sending
        const sendBtn = form.querySelector('.telegram-button');
        if (sendBtn) sendBtn.disabled = true;

        // send using emailjs
        emailjs.send('service_el0lt8l', 'template_7ct1i3g', {
          from_name:  nameVal,
          from_email: emailVal,
          phone:      phoneVal,
          message:    messageVal,
          rating:     ratingVal + ' ★',
          to_email:   'centrihealthLaboratory@gmail.com'
        })
          .then(() => {
            showModal(
              'success',
              'Thank You!',
              'Your review has been sent successfully. We will get back to you soon!'
            );

            // Reset form
            form.reset();
            document.querySelectorAll('#star-rating .star').forEach(s => s.classList.remove('active'));
            if (ratingInput) ratingInput.value = 0;

            if (sendBtn) sendBtn.disabled = false;
          })
          .catch((err) => {
            console.error('Email error:', err);
            showModal(
              'error',
              'Send Failed',
              'Something went wrong sending your message. Please try again or contact us directly.'
            );

            if (sendBtn) sendBtn.disabled = false;
          });
      });
    }

    // back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
      backToTopBtn.style.transition  = 'opacity 0.3s ease';
      backToTopBtn.style.pointerEvents = 'none';
      backToTopBtn.style.opacity     = window.scrollY > 200 ? '1' : '0';

      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          backToTopBtn.style.opacity      = '1';
          backToTopBtn.style.pointerEvents = 'auto';
        } else {
          backToTopBtn.style.opacity      = '0';
          backToTopBtn.style.pointerEvents = 'none';
        }
      });

      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // sitemap smooth scroll
    const navLinks = document.querySelectorAll('.sitemap a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          let targetElement = document.getElementById(targetId);
          if (!targetElement) {
            targetElement = document.getElementById(targetId + '-placeholder');
          }
          if (targetElement) {
            const headerOffset   = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition  = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
      });
    });

    // focus effects
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.01)';
      });
      input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
      });
    });

  }

})();
