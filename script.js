'use strict';

const logo = document.querySelector('.nav__logo');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navContainer = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

const closeModal = function (e) {
    e.preventDefault();
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.style.overflow = ''; // as same as just to set it to "auto"
};

btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal(e);
    }
});

/////////////////////////////////////////////////////////
// Implementing Smooth Scrolling

////////////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', e => {
    const s1coords = section1.getBoundingClientRect(); // here because it needs to be updated every time we click btn, it didn't preserve otherwise

    //window.scrollBy(0, s1coords.y); // from the current position
    //window.scrollTo(0, document.documentElement.scrollTop + s1coords.y); // similar as above, basically property "y" or "top" is always relative to the viewport, but not to the document, so not to the top of the page

    //console.log(`Current position: ${document.documentElement.scrollTop}`); // distance between the current position of the viewport and the top of the page, also similar to window.pageYOffset
    //console.log(`Section coords: ${s1coords.y}`);
    //console.log((document.documentElement.scrollTop += s1coords.y));

    //console.log(
    //`Half of the viewport: ${document.documentElement.clientHeight / 2}`
    //);

    console.log(s1coords); // DOMRect, it doesn't behave like a life collection

    //console.log(e.target.getBoundingClientRect()); // DOMRect, button

    // distance between the current position of the viewport and the top of the page
    console.log(`Current scroll(X/Y)`, window.pageXOffset, window.pageYOffset); // window.pageYOffset is similar to document.documentElement.scrollTop and also to window.scrollY

    // it's just dimensions of the viewport that are actually available for the content. And of course that excludes any scroll bars.
    console.log(
        'height/width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );

    // Scrolling without animation
    // window.scrollTo(
    // s1coords.left + window.pageXOffset,
    // s1coords.top + window.pageYOffset
    // ); // top === y, left === x
    // document.documentElement.scrollTop = window.pageYOffset + s1coords.top; // it could be either pageYOffset, scrollTop or scrollY

    // Scolling with smooth animation
    //window.scrollTo({
    //left: s1coords.left + window.pageXOffset,
    //top: s1coords.top + window.pageYOffset,
    //behavior: 'smooth',
    //});

    // MODERN WAY of doing scroll animation
    section1.scrollIntoView({ behavior: 'smooth' }); // s1coords is a DOM rect, not an element
    // if we didn't specify anything in arguments, then default is true which is {block: "start", inline: "nearest"}, false - {block: "end", inline: "nearest"}
});

//////////////////////////////////////////////////////////
// Event Delegation, Implementing Page Navigation

//////////////////////////////////////////////////
// Opposite version(bad), where we attach on every single link a callback function which is good, but if there is too much buttons, like 10000, then it will certainly impact the performance

//document.querySelectorAll('.nav__link').forEach(function (el) {
//el.addEventListener('click', e => {
// e.preventDefault();

//const id = e.currentTarget.getAttribute('href'); // relative path

//document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

///////////////////////////////////////////////////////////////////
//const section = document.querySelector(e.target.getAttribute('href')); // e.target or e.currentTarget, it doesn't really matter which one to use

//window.scrollTo({
//left: section.getBoundingClientRect().left + window.pageXOffset,
//top: section.getBoundingClientRect().top + window.pageYOffset, // or instead of writing window.pageYOffset, we could also write document.documentElement.scrollTop and also window.scrollY
//behavior: 'smooth',
//});
// left === x, top === y

//window.scrollBy({
//left: section.getBoundingClientRect().x,
//top: section.getBoundingClientRect().y,
//behavior: 'smooth',
//});
// left === x, top === y

//document.documentElement.scrollTop += section.getBoundingClientRect().y; // that's only for vertical scrolling and without animation
// top === y
//});
//});

// it's not efficient to add the exact same callback function to each of three elements, of course it would be fine for only three elements, but imagine if we had 1000, or like 10,000 elements?
// if we were attach an event handler to 10,000 elements, so like we did with forEach function, then we would effectively be creating 10,000 copies of this same function here.
// and so that would then certainly impact the performance, the better solution is to use EVENT DELEGATION

/////////////////////////////////////////////////////////
// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', e => {
    e.preventDefault();

    // the "this" keyword here is window object i must say that :D
    // e.target means where the event is originated(возникло)
    if (
        e.target &&
        e.target.matches('.nav__link') &&
        !e.target.matches('.nav__link--btn')
    ) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

//at some point, it will all make a lot of sense to you; so i hope that you're convinced that event delegation is a much better strategy, even though it requires
//a little bit more work than the first implementation that we did, and in fact there is actually an even more important use case of event delegation, which is when
//we are working with elements that are not yet on the page on runtime, so by the time the page loads, and a great example are buttons that are added dynamically
//while using the application. So it's not possible to add event handlers on two elements that do not exist, but we will still be able to handle events on elements
//that don't exist at the beginning by using event delegation one more time

////////////////////////////////////////////////////
// Building a Tabbed Component

tabsContainer.addEventListener('click', e => {
    e.preventDefault();

    //console.log(e.target);
    const clicked = e.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return; // if null, then returned

    tabsContent.forEach(content => {
        content.classList.remove(`operations__content--active`);
    });

    tabs.forEach(tab => {
        tab.classList.remove(`operations__tab--active`);
    });

    // also Array.from works exactly the same as spread operator with brackets notation
    //[...tabsContent]
    //.find(content =>
    //content.matches(`.operations__content--${e.target.dataset.tab}`)
    //)
    //.classList.add('operations__content--active');

    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`) // null, if it didn't find anything
        ?.classList.add('operations__content--active');

    clicked?.classList.add('operations__tab--active');
});

////////////////////////////////////////////////////
// Passing Arguments to Event Handlers
// check the all possible events
// mouseenter(opposite is mouseleave) doesn't bubble, but here we need the event to actually bubble so that it can even reach the navigation element
// and so therefore, we use mouseover(opposite is mouseout)

// MENU FADE ANIMATION
// bind(null(or use some real data), data -> if there is more than 2,3 elements we would specify rest pattern in parameters for simplicity) and event still exists (exception)
// we can bind the "this" keyword by pass in the data(more than 2,3 elements, then set the "this" to the object or array) and specify "e" which stands for the event in the parameters, Jonas prefer this one and me too :)
const handleHover = function (e) {
    // console.log(e.target); // if you are using mouseenter or mouseleave instead of mouseover and mouseout, then you wouldn't get access to the child elements of the DOM element that is the handler is attached to, e.target or e.currentTarget points to the DOM element
    if (e.target.matches('.nav__link')) {
        const link = e.target;
        const logo = document.querySelector('.nav__logo');
        const otherLinks = Array.from(
            document.querySelectorAll('.nav__link')
        ).filter(anchor => anchor !== link);

        /*
            if you are using event delegation then you should know 2 ways of handling the specific target:
            1. when your event originates on the target which didn't have the children, then you would use the e.target
            2. when your event originates on the target which do have children, for example the event originates on the button that has a span element, then you should use closest method on the e.target to pass in the button's selector
            if you are not using event delegation:
            use e.currentTarget or e.target, it doesn't really matter, unless you have children on it's target, then go to step 2
        */

        // or just e.currentTarget
        //const children = [...e.target.closest('.nav').children].flatMap(el => {
        //return el.children.length !== 0 ? [...el.children] : el;
        //});

        //let [logo, ...links] = children;
        //const otherLinks = links
        //.flatMap(el => [...el.children])
        //.filter(anchor => anchor !== link);

        logo.style.opacity = this;
        otherLinks.forEach(other => (other.style.opacity = this));
    }

    if (e.target.matches('.nav__logo')) {
        const otherLinks = document.querySelectorAll('.nav__link');
        otherLinks.forEach(link => (link.style.opacity = this));
    }
};

// not using closest because there is no child elements that we could accidentally hover or click
navContainer.addEventListener('mouseover', handleHover.bind(0.5));

navContainer.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////////////
// Implementing a Sticky Navigation_ The Scroll Event
// that's work just fine but this is pretty bad for performance, so using the scroll event for performing a certain action at a certain position of the page is really not the way to go, that's because
// the scroll event here fires all the time, no matter how small the change is here in the scroll
//window.addEventListener('scroll', () => {
//if (document.querySelector('#section--1').getBoundingClientRect().y < 0) {
//navContainer.classList.add('sticky');
//}

//// window.pageYOffset
//if (window.scrollY === 0) {
//navContainer.classList.remove('sticky');
//}
//});

//////////////////////////////////////////////////////////
// A Better Way The Intersection Observer API
// This API allows our code to basically observe(наблюдать) changes to the way that(в том как) a certain target element intersects another element, or the way it intersects the viewport

/*
const stickyNavCallback = function (entries, observer) {
    // entries argument is an array of the threshold entries
    // observer -> is the "new IntersectionObserver"

    entries.forEach(entry => {
        console.log(entry);
        if (entry.boundingClientRect.y < 0 || entry.isIntersecting) {
            navContainer.classList.add('sticky');
        } else {
            navContainer.classList.remove('sticky');
        }
    });
};

const stickyNavOptions = {
    root: null, // root element can be either a specific element in the document which is an ancestor of the element to be observed, or null to use the document's viewport as the container
    threshold: 0.02, // 0% here means that basically our callback will trigger each time that the target element moves completely out of the view and also as soon as it enters the view
    // 1 means that the callback will only be called when 100% of the TARGET is actually visible in the viewport, so in the case of the section1 that would be impossible because the section itself is already
    // bigger than the viewport
};

new IntersectionObserver(stickyNavCallback, stickyNavOptions).observe(section1); // section1 is a target;
*/

const navHeight = navContainer.getBoundingClientRect().height;

const stickyNav = function (entries) {
    // entries is an regular array
    const [entry] = entries;
    console.log(entry);

    !entry.isIntersecting && navContainer.classList.add('sticky');
    entry.isIntersecting && navContainer.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    // threshold: 0.95, // the callback will only be called when 95% of the observed target, so our TARGET(header) is actually visible in the viewport
    // rootMargin: `-${navHeight}px`, // is the box that will be applied outside of our target element, so of our header here. Percentages and rems doesn't work at this property, behaves like a normal margin for the target(header)
    threshold: 1,
    rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////////////////////////////
// Revealing Elements on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
    // entries argument is an array of the threshold entries
    const [entry] = entries;
    console.log(entry);

    // guard clause
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');

    // small improvement which is to get rid of observe by setting unobserve method
    observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
    root: null, // viewport
    threshold: 0.22,
});

allSections.forEach(section => {
    sectionsObserver.observe(section);
    section.classList.add('section--hidden');
});

// LOGO ANCHOR
logo.addEventListener('click', e => {
    //document.body.scrollIntoView({ behavior: 'smooth' });

    //window.scrollBy({
    //left: document.body.getBoundingClientRect().left,
    //top: document.body.getBoundingClientRect().top,
    //behavior: 'smooth',
    //});

    window.scrollTo({
        left: window.scrollX + document.body.getBoundingClientRect().left, // window.pageXOffset, document.documentElement.scrollLeft
        top: window.scrollY + document.body.getBoundingClientRect().top, // window.pageYOffset, document.documentElement.scrollTop
        behavior: 'smooth',
    });
});

//////////////////////////////////////////////////////////
// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, observer) {
    const [entry] = entries;

    // entry.target is the element that is currently being intersected
    if (!entry.isIntersecting) return; // important to specify otherwise first image will appear accidentally
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target); // so we woudn't have to call this function every time the target intersects with our root
};

const imgObserver = new IntersectionObserver(loadImage, {
    root: null,
    threshold: 1,
    rootMargin: '-80px',
    //threshold: 0,
    //rootMargin: '200px',
});

imgTargets.forEach(img => {
    imgObserver.observe(img);
});

//////////////////////////////////////////////////////////
// Building a Slider Component
const slider = function ({ slides, btnLeft, btnRight, currentSlide }) {
    // Functions
    const goToSlide = function (curSlide) {
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
        });
    };

    const updateDots = function (currentSlide) {
        Array.from(dotsContainer.children).forEach(dot => {
            dot.classList.remove('dots__dot--active');
        });

        Array.from(dotsContainer.children)
            .find(dot => +dot.dataset.slide === currentSlide)
            .classList.add('dots__dot--active');

        goToSlide(currentSlide);
    };

    const createDots = function () {
        slides.forEach((_, i) => {
            //const dot = document.createElement('button');
            //dot.classList.add('dots__dot');
            //if (i === 0) dot.classList.add('dots__dot--active');
            //dot.dataset.slide = i;
            //dotsContainer.append(dot);

            dotsContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot ${
                    i === 0 ? 'dots__dot--active' : ''
                }" data-slide="${i}"></button>`
            );
        });
    };

    const switchSlider = function () {
        if (this) ++currentSlide;
        else --currentSlide;

        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide > slides.length - 1) currentSlide = 0;

        updateDots(currentSlide);
    };

    const init = function () {
        currentSlide =
            currentSlide >= 0 && currentSlide < slides.length
                ? currentSlide
                : 0;
        createDots();
        updateDots(currentSlide);
    };
    init();

    // Next slide
    btnRight.addEventListener('click', switchSlider.bind(true));

    // Prev slide
    btnLeft.addEventListener('click', switchSlider.bind(false));

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowRight':
                switchSlider.call(true);
                break;
            case 'ArrowLeft':
                switchSlider.call(false);
                break;
        }
    });

    dotsContainer.addEventListener('click', e => {
        e.preventDefault();

        if (e.target.matches('.dots__dot')) {
            currentSlide = +e.target.dataset.slide;

            updateDots(currentSlide);
        }
    });
};

slider({
    slides: document.querySelectorAll('.slide'),
    btnLeft: document.querySelector('.slider__btn--left'),
    btnRight: document.querySelector('.slider__btn--right'),
    currentSlide: 0,
});

//////////////////////////////////////////////////////////
// LECTURES
//
// https://developer.mozilla.org/en-US/docs/Web/CSS/:is#difference_between_is_and_where

/*
    document.querySelector('.nav__links').querySelector('.btn--show-modal');
*/

/*
    document.querySelector('.nav__links').querySelector('.btn--show-modal').closest('ul') // closest ancestor, the DOM element
*/

/*
 * // children essentially a html collection
    Array.from(document.querySelector('.nav__links')
    .querySelector('.btn--show-modal')
    .closest('ul').children) // we're back to .nav__links essentially, the element
    .map(li => li.children[0])
    .forEach(el => console.log(el.matches('.btn--show-modal'))) // true, if the Element matches the selectors. Otherwise, false.
*/

/**
    document.querySelector('.nav__links').insertAdjacentHTML('afterend', '<h1>Hello</h1>');
    const cloneH1 = document.querySelector('h1').cloneNode(false); // only the node will be cloned. The subtree, including any text that the node contains, is not cloned.
    const cloneH1 = document.querySelector('h1').cloneNode(true); // the node and it's whole subtree, including text that may be in child Text nodes, is also copied.
*/

/*
    Array.from(document.querySelector('.nav__links').children)
    .flatMap(li => [...li.children])
    .find(el => el.matches('.btn--show-modal'))
*/

/*
    Object.fromEntries(
        Array.from(document.querySelector('.nav__links').children)
        .flatMap(li => [...li.children])
        .filter(el => el.matches('.btn--show-modal'))
        .entries()
    )
*/

/*
    [...Array.from(document.querySelector('.nav__links').children)
    .flatMap(li => [...li.children])
    .filter(el => el.matches('.btn--show-modal'))
    .entries()] // after entries method we getting array iterator object which haven't got methods as arrays has
    .reduce((acc, [key, value]) => Object.assign(acc, {[key]: value}), {})
*/

/*
///////////////////////////////////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
console.log(document.documentElement); // entire HTML
console.log(document.body);
console.log(document.head);

const header = document.querySelector('.header'); // result is DOM object

const allSections = document.querySelectorAll('.section'); // NodeList
console.log(allSections);

document.getElementById('section--1'); // just an element, so the DOM object

// HTML collection is so-called life collection. And that means that if the DOM changes then this collection
// is also immediately updated automatically. So our NodeList doesn't have this property
// document.getElementsByName(); // NodeList
const allButtons = document.getElementsByTagName('button'); // HTML collection
const nodeButtons = document.querySelectorAll('button'); // NodeList
console.log(allButtons);
console.log(nodeButtons);

console.log(document.getElementsByClassName('btn')); // HTML collection
// .querySelector() and .querySelectorAll() are more modern ones but getElementsByClassName, getElementsByTagName
// also have a place when you need HTML collection which in some situation is useful but most of the time,
// Jonas prefer to simply keep using .querySelector() and .querySelectorAll();

// Creating and inserting elements

// Element.insertAdjacentHTML(position, text)
// Element.insertAdjacentElement(position, element)

const message = document.createElement('div'); // passing the string of basically the tag name
// message is not yet in the DOM itself, so it's nowhere to be found on our webpage;

message.classList.add('cookie-message');
//message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
    'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// we can use the prepend and append methods not only to insert elements but also to move them, and again
// that is because a DOM element is unique. So it can always only exist at one place at a time.
header.prepend(message);
//header.append(message);
// to insert multiple copies of the same element we have to use .cloneNode()
//header.append(message.cloneNode(true)); // true means is that all the child elements will also be copied

// SIBLINGS
// same as for prepend and append methods
//header.before(message);
//header.after(message);

// Delete elements
// so arrow functions doesn't have the "this" keyword and also "arguments" keyword which is the iterable! use function expression instead
// SOLVE "this" and e.currentTarget are equal, if it was function expression instead of arrow function which is point to outer lexical scope, so the parent's function scope

document.querySelector('.btn--close-cookie').addEventListener('click', e => {
    e.preventDefault();

    // Jonas take
    message.remove();
    //message.parentElement.removeChild(message); // the way of moving up and down in the DOM tree like selecting
    //the parent element is called DOM traversing

    // Skinder take
    //console.log(this);
    //console.log(e.currentTarget); // still works even with arrow function
    //console.log(this === e.currentTarget); // true, if there is a function expression, otherwise false, because then "this" will be the window object
    //the reason for that is an arrow's function behavior
    
    //e.target.parentElement.remove();
    //header.removeChild(e.target.parentElement); // if the body wasn't any match a particular child, then it will certainly be an error
    //e.currentTarget.parentElement.parentElement.removeChild(
    //e.currentTarget.parentElement
    //);

    console.log('deleted');
});

////////////////////////////////////////////////////
// Styles, Attributes and Classes

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//console.log(message.style.height); // got basically empty string, because there's no inline style
//console.log(message.style.backgroundColor); // i'll got inline style because i already specified

console.log(getComputedStyle(message).color); // the string
console.log(getComputedStyle(message).height); // the string

message.style.height = `${
    Number.parseFloat(getComputedStyle(message).height, 10) + 30
}px`;

// document root in css is equivalent to the document in JavaScript, so basically the documentElement
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // SOLVE alt will be empty string if we won't specify in HTML
console.log(logo.className); // also empty if it wasn't provided in HTML

logo.alt = 'Beautiful minimalist logo';

// JavaScript doesn't create automatically property that is not a standard, only the way to specify attribute to the DOM element is to use .setAttribute() method
console.log(logo.designer); // undefined

// but of course we could still get "designer" attribute
console.log(logo.getAttribute('designer'));
// and set it if we want it
logo.setAttribute('designer', 'Jonas');
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// to get relative URL, instead of absolute one, we need to use getAttribute
console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative

// same true for the href attribute on links
const link = document.querySelector('.nav__link--btn');
console.log(link);
console.log(link.href); // absolute
console.log(link.getAttribute('href')); // relative

// Special type of attributes and that's DATA ATTRIBUTES
console.log(logo.dataset.versionNumber); // case sensitive on camelCase
console.log(logo.dataset); // DOMStringMap

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.toggle('j');
console.log(logo.classList.contains('c', 'j')); // not includes like it's called in arrays, returns true if it finds first satisfied class, or false if it's not

// just as we could read the className, we could also use that to set a class
logo.className = 'Jonas'; // Don't use, because it's override all the existing classes
*/

/*
/////////////////////////////////////////////////
// Types of Events and Event Handlers

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
    alert('addEventListener: Great! You are reading the heading :D');
    // of course we could do the same with the "this" keyword but in case we would use arrow function then we get window object
    e.currentTarget.removeEventListener('mouseenter', alertH1);
    console.log(e.currentTarget);
    //h1.removeEventListener('mouseenter', alertH1);
};
// there are three ways why addEventListener is better
// first one is that is allows us to add multiple event listeners to the same event(click, mouseenter), on the other hand on-event property that has function value and after adding a new one then the first function will gonna be overrided
// second one is even more important that we can remove event handler in case we don't need it anymore
// third one is by using an HTML attribute, this one should actually not be used, but just for the sake of curiosity, Jonas have been mention this anyway
// so it fires whenever a mouse enters a certain element, so just as the name says.
h1.addEventListener('mouseenter', alertH1);

// we can add mulitple event listeners on the same event
h1.addEventListener('mouseenter', () => {
    alert('Hello');
});

//setTimeout(() => {
//h1.removeEventListener('mouseenter', alertH1);
//}, 1000);

// it used to be done like this in the old days, but now we usually always use addEventListener
//h1.onmouseenter = function (e) {
//alert('onmouseenter: Great! You are reading the heading :D');
//};

// just to clarify, and it doesn't work without exporting the function
//h1.addEventListener('mouseenter', e => {
//alert('addEventListener: Great! You are reading the heading :D');
//e.currentTarget.removeEventListener('mouseenter', );
//});
*/

//////////////////////////////////////////////
// Event Propagation Bubbling and Capturing
// https://developer.mozilla.org/en-US/docs/Web/Events

// let's say that a click happens on a link and as we already know, the DOM then generates a click event right away.
// However, this event is actually not generated at the target element, so at the element, where the event happened,
// instead the event is actually generated at the root of the document, so at the very top of the DOM tree
// And from there, the so-called capturing phase happens, where the event then travels all the way down from the document root
// to the target element, and as the event travels down the tree, it will pass through every single parent element of the target element
// So in our example, here, the HTML element, the body element, the section, then the paragraph, until it finally reaches it's target.
// As soon as the event reaches the target, the target phase begins, where events can be handled right at the target
// And as we already know, we do that with event listeners, such as this one, so event listeners wait for a certain event to happen
// on a certain element, and as soon as the event occurs, it runs the attached callback function.
// In this example(document.querySelector('a').addEventListener('click', () => {alert('You clicked me')})), where 127.0.0.1:8080 says -> you clicked me, it will simply create this alert window
// and this happens in the target phase, now after reaching the target, the event then actually travels all the way up to the document root again,
// in the so-called bubbling phase. So we say that events bubble up from the target to the document root and just like in the capturing phase,
// the event passes through all it's parent elements, and really just the parents, so not through any sibling elements. So as an event travels down and up the tree,
// they pass through all the parent elements, but not through any sibling element. But i might be wondering why is this so important?
// Why are we learning about all this detail? Well, it is indeed very important because basically, it's as if the event also happened in each of the parent elements.
// So again, as the event bubbles through a parent element, it's as if the event had happened right in that very element. What this means is that if we attach the same
// event listener, also for example, to the section element (document.querySelector('section').addEventListener('click', () => {alert('You clicked me')})), then we would get the exact
// same alert window for the section element as well. So we would have handled the exact same event twice, once at it's target, and once at one of it's parent elements.
// and this behavior will allow us to implement really powerful patterns, as we will see  throughout the rest of the section. So this really is very, very important to understand.

// Now by default, events can only be handled in the target, and in the bubbling phase. However, we can set up event listeners in a way that they listen to events in the capturing phase instead.
// Also, actually not all types of events that do have a capturing and bubbling phase, some of them are created right on the target element, and so we can only handle them there.
// But really, most of the events do capture and bubble, such as I described it here in this lecture, we can also say that events propagate, which is really what capturing and bubbling is.
// It's events propagating from one place to another.

/*
<html>
    <head>
        <title>A Simple Page</title>
    </head>

    <body>
        <section>
            <p>A paragraph with a <a>link</a></p>

            <p>A second paragraph</p>
        </section>

        <section>
            <img src="dom.png" alt="The DOM" />
        </section>
    </body>
</html>
*/

/*
///////////////////////////////////////////////
// Event Propagation in Practice

// rgb(255, 255, 255)
const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min); // important (max - min + 1) not (max - min) + 1
// without + 1 we will get numbers between 0 and not including the value that was specified, within the + 1 we will get numbers between 0 and included value

const randomColor = () =>
    `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// the event is the same in all three callback functions because of event bubbling, so the event originates, for example on the link, but then it bubbles up to it's parent element
// And from there to it's next parent element, and from there, it will travel even further up in the DOM Tree. And so we can then handle that event in all of the parent elements and
// that is exactly what we did, there is also currentTarget which is indeed the element on which the event handler is attached.
document.querySelector('.nav__link').addEventListener('click', e => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = randomColor();
    //e.target.style.backgroundColor = randomColor();
    console.log('LINK', e.target, e.currentTarget);
    console.log(e.currentTarget === this); // "this" keyword is also the one pointing to the element on which the EventListener is attached to, except if it the function itself is an arrow function
    // then it will be window object instead;

    // Stop propagation
    //e.stopPropagation(); // therefore these event never reached this document.querySelector('.nav__links') which is it's parent, and also, not document.querySelector('.nav')
    // in practice that usually not a good idea to stop propagation

    // Event Listener is only listening for events in the bubbling phase, but not in the capturing phase, so that is the default behavior of the addEventListener method
    // and the reason for that is that the capturing phase is usually irrelevant for us. It's just not that useful. Now, on the other hand, the bubbling phase can be very
    // useful for something called EVENT DELEGATION. However if we really do want to catch events during the capturing phase, we can define a third parameter in the addEventListener function.
    // For example, we can set the third parameter to true or false
});

document.querySelector('.nav__links').addEventListener('click', e => {
    e.currentTarget.style.backgroundColor = randomColor();
    //e.target.style.backgroundColor = randomColor();
    console.log('UL', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
    'click',
    
    e => {
        e.currentTarget.style.backgroundColor = randomColor();
        //e.stopPropagation();
        //e.target.style.backgroundColor = randomColor();
        console.log('NAV', e.target, e.currentTarget);
    }

    //true
    // useCapture
    // true // by default is false
); // the event handler will no longer listen to bubbling events, instead to capturing events, so the NAV is actually the first appearing, so you see that now the first element through
// which the event passes, is the navigation, and reason for that is that this element is now actually listening for the event as it travels down from the DOM, while these other ones are listening
// for the event, as it travels back up and so that happens later and therefore, the NAV is now the first one to show up
*/

/*
///////////////////////////////////////////////////
// DOM Traversing
// DOM traversing is basically walking through the DOM. Which means that we can select an element based on another element and this is very important because sometimes we need to
// select elements relative to a certain other element. For example, a direct child or a direct parent element. Or sometimes we don't even know the structure of the DOM at runtime
// And in all these cases, we need DOM traversing.

const h1 = document.querySelector('h1'); // DOM object

// querySelector also works for elements, not only for document -_-

////////////////////////////////////////////////////
// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // NodeList
// as Jonas said, it would go down as deep as necessary into the DOM tree. Also, if there were other highlight elements on the page, they wouldn't get selected
// because they would not be children of the h1 element

// To get child elements
console.log(h1.childNodes); // NodeList
console.log(h1.children); // HTML Collection

// These names are a little bit confusing, but one more time, that's because of the messy nature of JavaScript with all of these things being implemented at different points in time.
// And so therefore it was difficult to keep consisting naming conventions.
console.log(h1.firstChild); // first NODE
console.log(h1.lastChild); // last NODE

// But anyway, there is better way of receiving first element and last one
h1.firstElementChild.style.color = 'white'; // first ELEMENT
h1.lastElementChild.style.color = 'orangered'; // last ELEMENT

//////////////////////////////////////////////////////
// Going upwards: parents
console.log(h1.parentNode); // direct node?
console.log(h1.parentElement); // the one that we are interested in, also it's a so-called direct parent

// Finding closest ancestor Element
h1.closest('.header').style.background = 'var(--gradient-secondary)';

// if this selector actually matches the element on which we are calling closest, then that's gonna be exactly the element itself
h1.closest('h1').style.background = 'var(--gradient-primary)';

// so we can think of closest here as basically being the opposite of querySelector. So both receive a query string as an input
// but querySelector finds children, no matter how deep is the DOM tree, while closest method finds parents, and also no matter how far up in the DOM tree.
// so very important method here to keep in mind

////////////////////////////////////////////////////
// Going sideways: siblings
// for some reason in JavaScript, we can only access direct siblings, basically only the previous and the next one
console.log(h1.previousElementSibling); // null, since this is a first child of the parent element
console.log(h1.nextElementSibling); // h4 is returned

// just like before we also have the same methods or actually the same properties for nodes
console.log(h1.previousSibling); // DOM object
console.log(h1.nextSibling); // DOM object

// if we really need all the siblings and not just the previous and the next one, then we can use the trick of moving up to the parent element and then read all the children from there.
console.log(h1.parentElement.children); // HTML collection

// change some style to all siblings, but except the element itself
[...h1.parentElement.children].forEach(el => {
    // h1 is our original element itself
    if (el !== h1) {
        // comparisons between elements work just fine.
        el.style.transform = 'scale(0.5)';
    }
});
*/
