'use strict';

///////////////////////////////////////
// Modal window
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
// also have a place when you need HTML collection which is some situation is useful but most of the time,
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
// SOLVE this and e.currentTarget are equal

document
    .querySelector('.btn--close-cookie')
    .addEventListener('click', function (e) {
        e.preventDefault();

        // Jonas take
        message.remove();
        //message.parentElement.removeChild(message); // the way of moving up and down in the DOM tree like selecting
        //the parent element is called DOM traversing

        // Skinder take
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

//console.log(message.style.height); // got basically nothing
//console.log(message.style.backgroundColor); // i'll got inline style because we already specified

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// error
message.style.height = `${getComputedStyle(message).height + 40}px`;
