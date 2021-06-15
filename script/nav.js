const burger = document.querySelector('.c-header-hamburger');
const nav = document.querySelector('.c-sidebar');

burger.addEventListener('click', () => {
    if(nav.style.opacity == "1" && nav.style.width == "300px") {
        nav.style.width = "0px";
        nav.style.opacity = 0;
    } else {
        nav.style.opacity = 1;
        nav.style.width = "300px";
    }
})