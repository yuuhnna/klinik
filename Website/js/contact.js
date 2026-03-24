(function () {

  // -- Detect if we're at root or inside a subfolder --
  const isRoot = !window.location.pathname.includes('/pages/');
  const basePath = isRoot ? '' : '../';

  // -- Load EmailJS SDK --
  const ejsScript = document.createElement('script');
  ejsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  ejsScript.onload = function () {
    // REPLACE 'YOUR_PUBLIC_KEY' after you create a free EmailJS account
    emailjs.init('AY7h3fROo-KZdBXe3');
  };
  document.head.appendChild(ejsScript);

  // -- Load contact component --
  fetch(basePath + 'pages/contact.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('contact-placeholder').innerHTML = html;
      initContactScripts();
    });

})();

// ========== MODAL HELPERS ==========
function showModal(type, title, message) {
  const overlay = document.getElementById('contact-modal');
  const iconEl = document.getElementById('modal-icon');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');

  if (!overlay) return;

  iconEl.textContent = type === 'success' ? '✅' : '❌';
  titleEl.textContent = title;
  msgEl.textContent = message;

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

function initContactScripts() {

  // ========== STAR RATING SYSTEM ==========
  const stars = document.querySelectorAll('#star-rating .star');
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
        for (let i = 0; i <= index; i++) {
          stars[i].style.color = '#000';
        }
      });
    });

    document.getElementById('star-rating').addEventListener('mouseleave', () => {
      stars.forEach(s => s.style.color = '');
      const currentRating = parseInt(ratingInput.value);
      stars.forEach((s, i) => {
        if (i < currentRating) s.classList.add('active');
      });
    });
  }

  // ========== FORM SUBMISSION via EMAILJS ==========
  const form = document.querySelector('.review-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[placeholder="YOUR NAME"]');
      const emailInput = form.querySelector('input[placeholder="EMAIL ADDRESS"]');
      const phoneInput = form.querySelector('input[placeholder="PHONE"]');
      const messageInput = form.querySelector('textarea[placeholder="MESSAGE"]');

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const phoneVal = phoneInput.value.trim();
      const messageVal = messageInput.value.trim();
      const ratingVal = ratingInput ? ratingInput.value : '0';

      // Validation
      if (!nameVal || !emailVal || !phoneVal || !messageVal) {
        showModal('error', 'Incomplete Form', 'Please fill in all fields before submitting.');
        return;
      }

      // Disable button while sending
      const sendBtn = form.querySelector('.telegram-button');
      if (sendBtn) sendBtn.disabled = true;

      // EmailJS send
      // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' after EmailJS setup
      emailjs.send('service_el0lt8l', 'template_7ct1i3g', {
        from_name: nameVal,
        from_email: emailVal,
        phone: phoneVal,
        message: messageVal,
        rating: ratingVal + ' ★',
        to_email: 'centrihealthLaboratory@gmail.com'
      })
        .then(() => {
          showModal(
            'success',
            'Thank You!',
            'Your review has been sent successfully. We will get back to you soon! 😊'
          );

          // Reset form
          form.reset();
          document.querySelectorAll('#star-rating .star').forEach(s => s.classList.remove('active'));
          if (ratingInput) ratingInput.value = 0;
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          showModal(
            'error',
            'Send Failed',
            'Something went wrong sending your message. Please try again or contact us directly.'
          );
        })
        .finally(() => {
          if (sendBtn) sendBtn.disabled = false;
        });
    });
  }

  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    });

    backToTopBtn.style.opacity = window.scrollY > 200 ? '1' : '0';
    backToTopBtn.style.transition = 'opacity 0.3s ease';
    backToTopBtn.style.pointerEvents = 'none';

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== SMOOTH SCROLL FOR NAVIGATION ==========
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
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ========== FORM INPUT FOCUS EFFECTS ==========
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });

  console.log('Contact scripts loaded successfully.');
}
