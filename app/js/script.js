// IBG
@@include("_ibg.js")

//=================================//

// меню бургер
@@include("_burger.js")

//=====================================//

//скролл до элемента
@@include("_scrollTo.js")

//=====================================//

// Изменение шапки (заднего фона), если страница проскроллена
function fixedHeader() {
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add("_scrolled");
        }
        if (window.scrollY == 0) {
            header.classList.remove("_scrolled");
        }
    }
}

window.addEventListener("scroll", fixedHeader);

//====================================//

// скролл до следующего элемента
const present = document.querySelector(".present");
const arrow = document.querySelector(".present__scroll-icon");

if (arrow) {
    arrow.addEventListener("click", scrollDown);
}

function scrollDown(e) {
    let nextBlock = present.nextElementSibling;
    let nextBlockCords = (nextBlock.getBoundingClientRect().top + scrollY) - header.clientHeight;
    console.log(nextBlockCords)
    window.scrollTo({
        top: nextBlockCords,
        behavior: "smooth",
    })
}

//==================================//

