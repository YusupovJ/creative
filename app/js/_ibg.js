function ibg() {
    let ibg = document.querySelectorAll(".ibg");
    for (let i = 0; i < ibg.length; i++) {
        const image = ibg[i];
        if (image.querySelector('img')) {
            image.style.backgroundImage = 'url(' + image.querySelector('img').getAttribute('src') + ')';
        }
    }
}

ibg();