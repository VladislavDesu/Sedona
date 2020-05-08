"use strict"

let mainNav = document.querySelector(".main-nav");
let btn = document.querySelector(".main-nav__btn");

mainNav.classList.remove("no-js");

btn.addEventListener("click", function(event) {
    event.preventDefault();
    mainNav.classList.toggle("main-nav--closed");
});
