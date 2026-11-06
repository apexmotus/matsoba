// Matšoba Floral — site interactivity
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '27713291054'; // 071 329 1054 in international format

  /* ---------------- Mobile nav ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------------- Carousel ---------------- */
  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var thumbsWrap = carousel.querySelector('.carousel-thumbs');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var index = 0;
    var autoplayDelay = 5500;
    var timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach(function (d, di) {
          d.classList.toggle('active', di === index);
        });
      }
      if (thumbsWrap) {
        var activeThumb = null;
        thumbsWrap.querySelectorAll('img').forEach(function (t, ti) {
          t.classList.toggle('active', ti === index);
          if (ti === index) activeThumb = t;
        });
        // Scroll only the thumbnail strip itself into view, never the page —
        // scrollIntoView() can bubble up and yank the whole page back to this
        // section even when block:'nearest' is used, if the strip is off-screen.
        if (activeThumb) {
          var target = activeThumb.offsetLeft - (thumbsWrap.clientWidth - activeThumb.clientWidth) / 2;
          thumbsWrap.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
        }
      }
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, autoplayDelay);
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to photo ' + (i + 1));
        b.addEventListener('click', function () { goTo(i); restartAutoplay(); });
        dotsWrap.appendChild(b);
      });
    }

    if (thumbsWrap) {
      slides.forEach(function (slide, i) {
        var img = slide.querySelector('img');
        var t = document.createElement('img');
        t.src = img.src;
        t.alt = img.alt;
        t.loading = 'lazy';
        t.addEventListener('click', function () { goTo(i); restartAutoplay(); });
        thumbsWrap.appendChild(t);
      });
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    // touch swipe
    var viewport = carousel.querySelector('.carousel-viewport');
    var startX = 0, deltaX = 0, dragging = false;
    viewport.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    viewport.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    viewport.addEventListener('touchend', function () {
      if (!dragging) return;
      if (deltaX > 40) prev();
      else if (deltaX < -40) next();
      deltaX = 0;
      dragging = false;
      restartAutoplay();
    });

    // keyboard
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
      if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
    });

    // pause on hover
    carousel.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    carousel.addEventListener('mouseleave', restartAutoplay);

    goTo(0);
    restartAutoplay();
  }

  /* ---------------- WhatsApp quote form ---------------- */
  var quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = quoteForm.querySelector('#q-name').value.trim();
      var bouquet = quoteForm.querySelector('#q-bouquet');
      var bouquetLabel = bouquet.options[bouquet.selectedIndex].text;
      var stems = quoteForm.querySelector('#q-stems').value.trim();
      var branch = quoteForm.querySelector('#q-branch');
      var branchLabel = branch.options[branch.selectedIndex].text;
      var notes = quoteForm.querySelector('#q-notes').value.trim();

      var lines = ['Hi Matšoba Floral! I\'d like a quote:'];
      lines.push('• Bouquet: ' + bouquetLabel);
      if (stems) lines.push('• Stems: ' + stems);
      lines.push('• Preferred branch: ' + branchLabel);
      if (name) lines.push('• Name: ' + name);
      if (notes) lines.push('• Notes: ' + notes);

      var message = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------------- Catalog "order via WhatsApp" buttons ---------------- */
  document.querySelectorAll('[data-wa-item]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.getAttribute('data-wa-item');
      var price = btn.getAttribute('data-wa-price');
      var message = encodeURIComponent(
        'Hi Matšoba Floral! I\'d like to order: ' + item + (price ? ' (R' + price + ')' : '') + '. Please confirm availability and delivery.'
      );
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="/#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            var href = a.getAttribute('href') || '';
            a.classList.toggle('active', href.indexOf('#' + id) !== -1);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
