'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const opTabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const opContents = document.querySelectorAll('.operations__content');
const navLinksArea = document.querySelector('.nav__links');
const navBar = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const slideContainer = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Scroll

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  //Scroll method 1
  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: 'smooth',
  });

  //Scroll method 2
  // section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

//method 1 : event delegation

navLinksArea.addEventListener('click', function (e) {
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//method 2 : not recommend
// const navLinks = document.querySelectorAll('.nav__link');
// navLinks.forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

///////////////////////////////////////
// Operation Change

tabContainer.addEventListener('click', function (e) {
  //conclude which tab button triggers event
  const clickedTab = e.target.closest('.operations__tab');

  //if spot clicked is outside of button, then stop function
  //guard clause
  if (!clickedTab) return;

  //remove clicked effect on all tabs and active the clicked tab.
  opTabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedTab.classList.add('operations__tab--active');

  //make all content invisible then visualize selected one
  const showContent = document.querySelector(
    `.operations__content--${clickedTab.dataset.tab}`
  );

  opContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  showContent.classList.add('operations__content--active');
});

///////////////////////////////////////
// Navbar fade

const navLinkEffect = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const navLinkSiblings = e.target
      .closest('.nav')
      .querySelectorAll('.nav__link');
    const navLogo = e.target.closest('.nav').querySelector('.nav__logo');
    navLinkSiblings.forEach(link => {
      if (link !== e.target) {
        link.style.opacity = this;
      }
    });
    navLogo.style.opacity = this;
  }
};

navLinksArea.addEventListener('mouseover', navLinkEffect.bind(0.5));
navLinksArea.addEventListener('mouseout', navLinkEffect.bind(1));

///////////////////////////////////////
// Sticky Navigator
const navBarHeight = navBar.getBoundingClientRect().height;

//method 1: intersectionObserver()
const navStick = function ([entries], observer) {
  if (!entries.isIntersecting) {
    navBar.classList.add('sticky');
  } else navBar.classList.remove('sticky');
};
const obsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navBarHeight}px`,
};
const headerObserver = new IntersectionObserver(navStick, obsOption);
headerObserver.observe(header);

//method 2: NOT recommend
// const s1coords = section1.getBoundingClientRect();
// console.log(s1coords);
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > s1coords.top) {
//     navBar.classList.add('sticky');
//   } else navBar.classList.remove('sticky');
// });

///////////////////////////////////////
//Reveal section

const sectionReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  secObservers.unobserve(entry.target);
};

const secObservers = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.2,
});
sections.forEach(sec => {
  secObservers.observe(sec);
  sec.classList.add('section--hidden');
});

///////////////////////////////////////
//Lazy loading image
const lazyImgs = document.querySelectorAll('img[data-src]');

const imgReveal = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
};

const imgObserver = new IntersectionObserver(imgReveal, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImgs.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
//Slide

let currentSlide = 0;
const maxSlides = slides.length - 1;

//Add Slider's dots
const dotActive = function (slideNo) {
  const sliderDots = document.querySelectorAll('.dots__dot');
  sliderDots.forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`[data-slide = "${slideNo}"]`)
    .classList.add('dots__dot--active');
};

const dotCreate = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide = ${i}></button>`
    );
  });
};

const goToSlide = function (curSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlides) {
    currentSlide = 0;
  } else currentSlide++;
  goToSlide(currentSlide);
  dotActive(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlides;
  } else currentSlide--;
  goToSlide(currentSlide);
  dotActive(currentSlide);
};

//make every slide line horizontally

const init = function () {
  currentSlide = 0;
  goToSlide(0);
  dotCreate();
  dotActive(0);
};
init();

const btnNextSlide = document.querySelector('.slider__btn--right');
const btnPrevSlide = document.querySelector('.slider__btn--left');

btnNextSlide.addEventListener('click', nextSlide);
btnPrevSlide.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
    dotActive(currentSlide);
  } else if (e.key === 'ArrowLeft') {
    prevSlide();
    dotActive(currentSlide);
  }
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    dotActive(e.target.dataset.slide);
    goToSlide(e.target.dataset.slide);
  }
});

// const header = document.querySelector('header');
// const message = document.createElement('div');
// // message.textContent = 'We use cookie to improve functionality and analytic.';
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookie to improve functionality and analytic.<button class = "btn btn--close-cookie">Got it</button>';
// header.after(message);

// const btnCloseCookie = document.querySelector('.btn--close-cookie');
// btnCloseCookie.addEventListener('click', function () {
//   message.remove();
// });
