const menuIcon = document.querySelector(".menu__icon");
const menu = menuIcon.parentElement;

if (menuIcon && menu) {
    menuIcon.addEventListener("click", toggleMenu);
}

function toggleMenu() {
    menu.classList.toggle("_active");
    document.body.classList.toggle("_scroll-lock");
}

function closeMenu() {
    menu.classList.remove("_active");
    document.body.classList.remove("_scroll-lock");
}
