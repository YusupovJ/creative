const animItems = document.querySelectorAll("._anim-item");

if (animItems.length > 0) {
    window.addEventListener("scroll", animScroll)
    function animScroll() {
        for (let i = 0; i < animItems.length; i++) {
            const animItem = animItems[i];
            const animHeight = animItem.offsetHeight;
            const animOffset = offset(animItem).top;
            let animPoint = window.innerHeight - animHeight / 4;
            if (animPoint.innerHeight > window.innerHeight) {
                animPoint = window.innerHeight - window.innerHeight / 4;
            }
            //Если видно 1/4 часть элемента, добавляем класс
            if (scrollY > (animOffset - animPoint) && scrollY < (animOffset + animHeight / 4)) {
                animItem.classList.add("_active");
            } else {
                // но если есть спец класс, то класс не убираем
                if (!animItem.classList.contains("._anim-no-hide")) {
                    animItem.classList.remove("_active")
                }
            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.scrollX || document.documentElement.scrollLeft,
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft, };
    }
    setTimeout(animScroll(), 300)
}
