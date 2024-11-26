'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const message = document.createElement('div');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

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
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button Scrolling

btnScrollTo.addEventListener('click', function (e) {
  // calculating different coordinates
  // const s1coordinates = section1.getBoundingClientRect();
  // console.log(s1coordinates);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // old school way to implement smooth scroll
  // window.scrollTo({
  //   left: s1coordinates.left + window.pageXOffset,
  //   top: s1coordinates.y + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // ! modern way to implement smooth scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

/*
Method below works without event delegation, and it works just fine,
but it will create performance issues if number of elements are large
*/

// document.querySelectorAll('.nav__link').forEach(function (link, i) {
//   console.log(link);
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/* Now, below is the better method , which is using event delegation */

//1. Add event listener to comman parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

// [...tabs].forEach(el => {
//   el.addEventListener('click', function () {
//     console.log('click');
//   });
// });

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // guard clause (modern)
  if (!clicked) return;

  // Making the tabs active

  // removing the active class from every element
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  // adding the active class back to only the required active element
  clicked.classList.add('operations__tab--active');

  // Traditional way of 'guard clause'
  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }

  // Activate content area

  // removing the active class from every element
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // adding the active class back to only the required active element
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

const toggleFadeAnimation = function (link, opc) {
  const navLogo = link.closest('.nav').querySelector('.nav__logo');
  if (link.classList.contains('nav__link')) {
    const siblingElements = link.closest('.nav').querySelectorAll('.nav__link');
    siblingElements.forEach(el => {
      if (el !== link) {
        el.style.opacity = opc;
        navLogo.style.opacity = opc;
      }
    });
  }
};

nav.addEventListener('mouseover', function (e) {
  e.preventDefault();
  const link = e.target;
  // const siblingElements = link.closest('.nav').querySelectorAll('.nav__link');
  toggleFadeAnimation(link, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  e.preventDefault();
  const link = e.target;
  toggleFadeAnimation(link, 1);
});

//! alternative to above
// // passing "arguments" into handlers
// nav.addEventListener('mouseover', toggleFadeAnimation.bind(0.5))
// nav.addEventListener('mouseout', toggleFadeAnimation.bind(1))

// Sticky navigation
// window.addEventListener('scroll', function () {
//   /*
//    just for reference
//    console.log(window.pageYOffset);
//    pageYOffset = scrollY */
//   // console.log(window.scrollY);
//   if (window.scrollY >= section1.getBoundingClientRect().y + window.scrollY) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// !Sticky navigation : Intersection Observer API
// const obsCallback = function (entries, observer) {
//   console.log(entries);
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting === false) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// ! Reveal Sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ! how to select the elements with custom attributes
// * const elements = document.querySelectorAll('[custom-attribute]');
// console.log(elements);

// ! Lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);
// console.log(imgTargets);

const loadImg = function (entries, obersver) {
  const [entry] = entries;
  if (entry.isIntersecting === true) {
    // console.log(entry);
    entry.target.src = entry.target.dataset.src;
    // entry.target.classList.remove('lazy-img');
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    obersver.unobserve(entry.target);
  }
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  // const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');
  // slider.style.transform = `scale(0.25) translateX(-1050px)`;
  // slider.style.overflow = `visible`;

  // Function definitions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (activeSlide) {
    document.querySelectorAll('.dots__dot').forEach((dot, i) => {
      dot.classList.remove('dots__dot--active');
      if (dot.dataset.slide === String(activeSlide)) {
        dot.classList.add('dots__dot--active');
      }
    });
  };

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activeDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      previousSlide();
    }
  });

  dotContainer.addEventListener('click', function (e) {
    const { slide } = e.target.dataset; // object destructuring
    curSlide = Number(slide);
    goToSlide(slide);
    activeDot(slide);
  });
};
slider();
////////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//////////////////////////////////////

// selecting elements
// console.log(document);
// console.log(document.documentElement);
// console.log(document.body);
// console.log(document.head);

// const allSelections = document.querySelectorAll('.section');
// console.log(allSelections);
// console.log(modal.querySelector('.btn--close-modal'));

// const allButtons = document.getElementsByTagName('button'); // returns HTML collection not a nodelist
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn')); // also return HTML collection

// !
/*NOTE: REMEMBER THAT HTMLCollection ARE UPDATED DYNAMICALLY AND
NODEList REMAINS THE SAME ONCE CREATED , CHECK BY CONSOLE LOGGING
*/

// Creating and inserting elements
// .insertAdjacentHTML

message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.'

message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class = "btn btn--close-cookie">Got It !</button>';
// header.prepend(message); // message will the child element of the header

header.append(message); // again message will the child element of the header

// header.append(message.cloneNode(true));

// header.before(message); // message will be sibling element of header
// header.after(message); // again message will be sibling element of header

// ! Delete elements
const btnCloseCookie = document.querySelector('.btn--close-cookie');
btnCloseCookie.addEventListener('click', function () {
  message.remove();
  // message.parentElement.removeChild(message); older method of removing an element
});

//styles

// ! REMEMBER THESE PROPERTIS ARE ADDED AS INLINE CSS
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// console.log(message.style.color); // it won't show anything in the console, as the property is defined internally in the CSS and not javascript itself.
// console.log(message.style.backgroundColor); // this will show in the console, as the user has defined it directly in the javascript

// * If we want we can still see the internally defined CSS properties, we can still do that as follows-
// console.log(getComputedStyle(message).color); // property defined in CSS
// console.log(getComputedStyle(message).height); // this property is still not defined , but browser calculated it automatically internally.

// message.style.height = '100px';

message.style.height =
  Number.parseInt(getComputedStyle(message).height, 10) + 20 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// atrributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo);

// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.id);
// console.log(logo.className);

// console.log(logo.designer); // not a predfined / non-standard / user-defined attribute so it will be undefined

// console.log(logo.getAttribute('designer')); // this will return the value of the attribute

// // ways to change attribute values or create new attribute
// logo.setAttribute('alt', 'Beautiful minimalist logo'); //
// // logo.alt = 'minimalist logo alternate';
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src); // absolute version
// console.log(logo.getAttribute('src')); // relative version

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // again absolute
// console.log(link.getAttribute('href')); // again relative

// ! data attributes
// console.log(logo.dataset.versionNumber);

// Classes

// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// const alertH1 = function () {
//   alert('Mouse is over me!!');
//   h1.removeEventListener('mouseenter', alertH1);
// };
// ! modern way to listen to events
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', alertH1);

// ! old school way to listen to events
// h1.onclick = function () {
//   alert('old school way !');
// };

// ! we can remove an event listener anywhere like this
// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 2000);

// rgb(255,255,255)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // stop event propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });

// const h1 = document.querySelector('h1');

// ! Going downwards : child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.querySelectorAll('.highlight')[0]);

// console.log(h1.childNodes); // direct children + children at deeper levels aswell
// console.log(h1.children); // direct children Elements only

// console.log(h1.firstChild); // this is text , because a node could be anything like a text,comment,element etc.
// console.log(h1.firstElementChild);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'darkgreen';

// ! Going upwards : parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// // https://stackoverflow.com/questions/8685739/difference-between-dom-parentnode-and-parentelement

// // to find elements that may or may not be direct parents of the element ->
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// ! Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.backgroundColor = 'lightblue';
//     el.style.transform = `scale(0.75)`;
//   }
// });

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Loaded and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// ! Only use this when absolutely required
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
// });
