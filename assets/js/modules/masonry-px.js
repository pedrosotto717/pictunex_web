
function msr (containerSelector, itemsSelector, GRheight) {
    const items = document.querySelectorAll(itemsSelector),
          container = document.querySelector(containerSelector),
          imgItems = [...document.querySelectorAll('.masonry-item img')]

    for (let i = 0; i < items.length; i++) {

        const H = imgItems[i].height 
        let hFinal = 1

        if(H<500){
            hFinal = Math.ceil(H / GRheight)
        }else if(H>499 && H<1000){
            hFinal = Math.ceil( ((H / 2) / GRheight) )
        }else if(H>999){
            hFinal = Math.round( ((H / 3) / GRheight) )
        }

        hFinal = (hFinal < 10 ? hFinal : 9)

        items[i].style.gridRowEnd = 'span ' + hFinal;
        items[i].style.position = 'relative'

        setTimeout(()=>{
            container.classList.add("active")
            // container.style.gridAutoRows = "75px";
        },300);
    }
}