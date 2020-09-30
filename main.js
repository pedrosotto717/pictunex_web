import slidePX from "./assets/js/modules/slide-px.js"
import Images from "./assets/js/modules/images.js"

addEventListener("load",()=>{


  /**
   * Instance and initialization of the class Images
   */

  const API = new Images({
    url: "http://localhost/server/api",
    container: '.masonry-layout'
  })

  // call to load all images onload page
  API.loadAll(()=>{
    setTimeout(()=>{
      msr('.masonry-layout', '.masonry-item', 100)
    },2000)
  });

  // allow load Images doing Searchings
  addEventListener("submit",ev => {
    
    ev.preventDefault();
    if(ev.target.matches(".formSearch")){
      const keyWord = ev.target.firstElementChild.value
      API.loadSearch(keyWord)	
    }
  })

  // Init a handler for the Categories
  API.initCategories(".filter-imgs ul",(cont)=>{
    cont.addEventListener("click", ev => {

      if(ev.target.matches(".categories")){

        const value = ev.target.textContent

        API.loadByCategory(value,()=>{
           API.clearListCategories(ev.target.parentNode.dataset.numc)
        },{
           num: ev.target.parentNode.dataset.numc
          });

      }// end if ev.target.matches(".categories")

    });
  });


  /**
   * Instance and initialization of the class SlidePX
   */

  const slide = new slidePX({
    container: ".slide",
    items: ".slide__item",
    active: "is-active",
    activeOld: "is-active--prev",
    time: 6000,
    noMobile: true
  })
  // Added the observer and run the slider 
  slide.observer().run()


  /**
   * Listen to show and hidden the MENU
   */
  document.querySelector(".btn-menu").addEventListener("click", ev =>{
    console.log("Active")
    document.querySelector(".menu-main").classList.toggle("is-active-menu")
  })

  /**
   * Instance and initialization of the class lightBox
   * handler of the Gallery' lightBox
   */
  
  let lb = new lightBox(".modal", '.modal-gallery')

  lb.init(".modal-close", ".prev-img", ".next-img", ()=>{
    
    const containerGallery = document.querySelector(".pictunex-gallery")
    containerGallery.addEventListener("click", ev =>{
      if(ev.target.matches(".masonry-item figcaption")){
        lb.load(ev.target,'.masonry-item[data-imgid]')
      }
    })

  });

  
})





