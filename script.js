'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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
    document.body.style.overflow = '';
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
const btn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btn.addEventListener('click', e => {
    const s1coords = section1.getBoundingClientRect();

    //window.scrollBy(0, s1coords.y); // from the current position
    //window.scrollTo(0, document.documentElement.scrollTop + s1coords.y); // similar as above, basically property "y" or "top" is always relative to the viewport, but not to the document, so not to the top of the page
    //
    //console.log(`Current position: ${document.documentElement.scrollTop}`); // distance between the current position of the viewport and the top of the page, also similar to window.pageYOffset
    //console.log(`Section coords: ${s1coords.y}`);
    //console.log((document.documentElement.scrollTop += s1coords.y));

    //console.log(
    //`Half of the viewport: ${document.documentElement.clientHeight / 2}`
    //);

    console.log(s1coords); // it doesn't behave like a life collection

    //console.log(e.target.getBoundingClientRect()); // button

    // distance between the current position of the viewport and the top of the page
    console.log(`Current scroll(X/Y)`, window.pageXOffset, window.pageYOffset); // window.pageYOffset is similar to document.documentElement.scrollTop

    // it's just dimensions of the viewport that are actually available for the content. And of course that excludes any scroll bars.
    console.log(
        'height/width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );

    // Scrolling without animation
    //window.scrollTo(
    //s1coords.left + window.pageXOffset,
    //s1coords.top + window.pageYOffset
    //); // top === y, left === x
    //document.documentElement.scrollTop = window.pageYOffset + s1coords.top; // silly

    // Scolling with smooth animation
    //window.scrollTo({
    //left: s1coords.left + window.pageXOffset,
    //top: s1coords.top + window.pageYOffset,
    //behavior: 'smooth',
    //});

    // MODERN WAY of doing scroll animation
    section1.scrollIntoView({ behavior: 'smooth' }); // s1coords is a DOM rect, not an element
});

//////////////////////////////////////////////////////////
// LECTURES
//
// https://developer.mozilla.org/en-US/docs/Web/CSS/:is#difference_between_is_and_where

/*
    document.querySelector('.nav__links').querySelector('.btn--show-modal');
*/

/*
    document.querySelector('.nav__links').querySelector('.btn--show-modal').closest('ul') // the element
*/

/*
    Array.from(document.querySelector('.nav__links')
    .querySelector('.btn--show-modal')
    .closest('ul').children) // we're back to .nav__links essentially, the element
    .map(li => li.children[0])
    .forEach(el => console.log(el.matches('.btn--show-modal'))) // matches returns boolean
*/

/**
    document.querySelector('.nav__links').insertAdjacentHTML('afterend', '<h1>Hello</h1>');
    const cloneH1 = document.querySelector('h1').cloneNode(false); // only the node will be cloned. The subtree, including any text that the node contains, is not cloned.
    const cloneH1 = document.querySelector('h1').cloneNode(true); // including text nodes inside this element
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
    .entries()]
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
const allButtons = document.getElementsByTagName('button'); // HTML collection
const nodeButtons = document.querySelectorAll('button'); // NodeList
console.log(allButtons);
console.log(nodeButtons);

console.log(document.getElementsByClassName('btn')); // HTML collection
// .querySelector() and .querySelectorAll() are more modern ones but getElementsByClassName, getElementsByTagName
// also have a place when you need HTML collection which in some situation is useful but most of the time,
// Jonas prefer to simply keep using .querySelector() and .querySelectorAll();

// Creating and inserting elements

// .insertAdjacentHTML
// .insertAdjacentElement

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
//header.before(message);
//header.after(message);

// Delete elements
// so arrow functions doesn't have the "this" keyword and also "arguments" keyword which is the iterable! use function expression instead
// SOLVE "this" and e.currentTarget are equal

document.querySelector('.btn--close-cookie').addEventListener('click', e => {
    e.preventDefault();

    // Jonas take
    message.remove();
    //message.parentElement.removeChild(message); // the way of moving up and down in the DOM tree like selecting
    //the parent element is called DOM traversing

    // Skinder take
    //console.log(this);
    //console.log(e.currentTarget); // still works even with arrow function
    //console.log(this === e.currentTarget); // true
    //e.target.parentElement.remove();
    //document.body.removeChild(e.target.parentElement);
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

//console.log(message.style.height); // got basically nothing, because there's no inline style
//console.log(message.style.backgroundColor); // i'll got inline style because we already specified

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = `${
    Number.parseFloat(getComputedStyle(message).height, 10) + 30
}px`;

// document root in css is equivalent to the document, so basically the documentElement
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // SOLVE alt will be empty string if we won't specify
console.log(logo.className); // also empty if it wasn't provided

logo.alt = 'Beautiful minimalist logo';

// JavaScript doesn't create automatically property that is not a standard
console.log(logo.designer); // undefined

// but of course we could still get "designer" attribute
console.log(logo.getAttribute('designer'));
logo.setAttribute('designer', 'Jonas');
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// to get relative URL, instead of absolute one, we need use getAttribute
console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative

// same true for the href attribute on links
const link = document.querySelector('.nav__link--btn');
console.log(link);
console.log(link.href); // absolute
console.log(link.getAttribute('href')); // relative

// Special type of attributes and that's DATA ATTRIBUTES
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.toggle('j');
console.log(logo.classList.contains('c', 'j')); // not includes like it's called in arrays

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
// first one is that is allows us to add multiple event listeners to the same event, on the other hand on-event property which is the first function that is gonna be overrided by the second function
// second one is even more important that we can remove event handler in case we don't need it anymore
// third one is by using an HTML attribute, this one should actually not be used, but just for the sake of curiosity, Jonas had to mention this
// so it fires whenever a mouse enters a certain element, so just as the name says.
h1.addEventListener('mouseenter', alertH1);

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
// And from there, the so-called capturing phase happens, where the event then travels all the way down from the document route
// to the target element, and as the event travels down the tree, it will pass through every single parent element of the target element
// So in our example, here, the HTML element, the body element, the section, then the paragraph, until it finally reaches it's target.
// As soon as the event reaches the target, the target phase begins, where events can be handled right at the target
// And as we already know, we do that with event listeners, such as this one, so event listeners wait for a certain event to happen
// on a certain element, and as soon as the event occurs, it runs the attached callback function.
// In this example(document.querySelector('a').addEventListener('click', () => {alert('You clicked me')})), where 127.0.0.1:8080 says -> you clicked me, it will simply create this alert window
// and this happens in the target phase, now after reaching the target, the event then actually travels all the way up to the document route again,
// in the so-called bubbling phase. So we say that events bubble up from the target to the document route and just like in the capturing phase,
// the event passes through all it's parent elements, and really just the parents, so not through any sibling elements. So as an event travels down and up the tree,
// they pass through all the parent elements, but not through any sibling element. But i might be wondering why is this so important?
// Why are we learning about all this detail? Well, it is indeed very important because basically, it's as if the event also happened in each of the parent elements.
// So again, as the event bubbles through a parent element, it's as if the event had happened right in that very element. What this means is that if we attach the same
// event listener, also for example, to the section element (document.querySelector('section').addEventListener('click', () => {alert('You clicked me')})), then we would get the exact
// same alert window for the section element as well. So we would have handled the exact same event twice, once at it's target, and once at one of it's parent elements.
// and this behavior will allow us to implement really powerful patterns, as we will see  throughout the rest of the section. So this really is very, very important  to understand.
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

///////////////////////////////////////////////
// Event Propagation in Practice
