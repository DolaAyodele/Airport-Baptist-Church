(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navigation');
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('is-open');
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-inner')) closeMenu();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const pageSections = [...document.querySelectorAll('main section[id]')];
  let navigationFrame;
  function updateCurrentSection() {
    navigationFrame = undefined;
    const marker = window.innerHeight * .45;
    let currentSection;
    pageSections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) currentSection = section.id;
    });
    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSection}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function queueNavigationUpdate() {
    if (navigationFrame === undefined) navigationFrame = window.requestAnimationFrame(updateCurrentSection);
  }
  window.addEventListener('scroll', queueNavigationUpdate, {passive: true});
  window.addEventListener('resize', queueNavigationUpdate);
  updateCurrentSection();
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  const image = document.querySelector('.church-image');
  function showImageFallback() {
    image.hidden = true;
    document.querySelector('.image-fallback').hidden = false;
  }
  image.addEventListener('error', showImageFallback);
  if (image.complete && image.naturalWidth === 0) showImageFallback();

  const galleryCards = [...document.querySelectorAll('.gallery-card')];
  const galleryDialog = document.querySelector('#gallery-dialog');
  const galleryImage = document.querySelector('#gallery-full-image');
  const galleryCaption = document.querySelector('#gallery-caption');
  const galleryCount = document.querySelector('#gallery-count');
  let currentPhoto = 0;
  let galleryTrigger;

  function displayPhoto(index) {
    currentPhoto = (index + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentPhoto];
    galleryImage.src = card.href;
    galleryImage.alt = card.querySelector('img').alt;
    galleryCaption.textContent = card.dataset.caption;
    galleryCount.textContent = `Photo ${currentPhoto + 1} of ${galleryCards.length}`;
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof galleryDialog.showModal !== 'function') return;
      event.preventDefault();
      galleryTrigger = card;
      displayPhoto(index);
      galleryDialog.showModal();
      document.body.classList.add('gallery-is-open');
      galleryDialog.querySelector('.gallery-close').focus();
    });
  });

  galleryDialog.querySelector('.gallery-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.gallery-prev').addEventListener('click', () => displayPhoto(currentPhoto - 1));
  galleryDialog.querySelector('.gallery-next').addEventListener('click', () => displayPhoto(currentPhoto + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  galleryDialog.addEventListener('click', event => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
  galleryDialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-is-open');
    galleryTrigger?.focus({preventScroll: true});
  });
})();
