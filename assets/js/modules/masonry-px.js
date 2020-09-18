
const ColectIMG = []

function msr (containerSelector, itemsSelector, GRheight) {
    const items = document.querySelectorAll(itemsSelector),
            container = document.querySelector(containerSelector),
            imgItems = [...document.querySelectorAll('.masonry-item img')]

    for (let i = 0; i < items.length; i++) {

        const H = imgItems[i].height 
        const W = imgItems[i].width 
        const newIMG = document.createElement("img")
        newIMG.src = imgItems[i].src
        ColectIMG.push(newIMG)

        console.log(H,Math.round((H) / GRheight),Math.round( ((H / 2) / GRheight) ),W,items[i])

        let hFinal = 1

        if(H<500){
            hFinal = Math.round(H / GRheight)
        }else if(H>499 && H<1000){
            hFinal = Math.round( ((H / 2) / GRheight) )
        }else if(H>999){
            hFinal = Math.round( ((H / 3) / GRheight) )
        }

        hFinal = (hFinal < 10 ? hFinal : 9)

        items[i].style.gridRowEnd = 'span ' + hFinal;
        items[i].style.position = 'relative'
    }
}

console.log('HEY')

addEventListener("load", ev => {
    msr('.masonry-layout', '.masonry-item', 100)
    console.log("Inicia")
})	
