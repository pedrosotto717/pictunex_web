import slidePX from "./assets/js/modules/slide-px.js"
import Images from "./assets/js/modules/images.js"

const d = document;

addEventListener("load", () => {

  /**
   * Instance and initialization of the class Images
   */

  const API = new Images({
    url: config.getURL_API(),
    container: '.masonry-layout'
  })



  // call to load all images onload page
  API.loadAll(() => {
    setTimeout(() => {
      msr('.masonry-layout', '.masonry-item', 100)
    }, 2000)
  });



  // allow load Images doing Searchings
  addEventListener("submit", ev => {

    ev.preventDefault();
    if (ev.target.matches(".formSearch")) {
      const keyWord = ev.target.firstElementChild.value
      API.loadSearch(keyWord, () => {
        if (d.querySelector(".menu-main").classList.contains("is-active-menu")) {
          d.querySelector(".btn-hamburguer").click()
          const searchBoxNav = d.querySelector(".search-container")

          if (searchBoxNav.classList.contains("show"))
            d.querySelector("#show-search-box").click()
        }
      });
    }
  });



  // Init a handler for the Categories
  API.initCategories(".filter-imgs ul", (cont) => {
    cont.addEventListener("click", ev => {

      if (ev.target.matches(".categories")) {

        const value = ev.target.textContent

        API.loadByCategory(value, () => {
          API.clearListCategories(ev.target.parentNode.dataset.numc)
        }, {
          num: ev.target.parentNode.dataset.numc
        });

      }// end if ev.target.matches(".categories")

    });
  });



  /**
   * Initialization and config of the Searching by Categories
   */
  d.querySelector(".modal-gallery .categories").addEventListener("click", ev => {

    if (ev.target.matches(".link-category")) {

      try {
        const value = ev.target.textContent,
          index = JSON.parse(localStorage.getItem("CATEGORIES")).categories.indexOf(value) + 1

        if (index != -1) {
          API.loadByCategory(value, () => {
            API.clearListCategories(index)
            d.getElementById("modal-gallery").classList.remove("active")
          }, { num: index });
        }

      } catch (e) {
        console.log(e);
      }

    }// end if ev.target.matches(".categories")

  });


  /**
   * Initialization of the IMAGES'S PAGINATION
   */

  API.initPagination(".pagination ul", (containerPagination, self) => {
    console.log('initPagination', API.allImages.length)
    containerPagination.addEventListener("click", ev => {

      if (ev.target.matches(".index-pag")) {
        ev.preventDefault()
        const value = parseInt(ev.target.dataset.pag)
        if (value != self.pag) {
          console.log(self.pag)
          self.pag = value
          self.loadCurrent()
          sessionStorage.setItem("CURRENT_PAG", self.pag)

          // clear class active from elements .index-pag
          containerPagination.querySelectorAll(".index-pag").forEach(el => {
            el.classList.remove("active")
          });

          // set class active to Element active 
          ev.target.classList.add("active")
        }
      }
    });
  }); // end <- IMAGES'S PAGINATION



  /**
   * Instance and initialization of the class SlidePX
   */

  const slide = new slidePX({
    container: ".slide",
    items: ".slide__item",
    active: "is-active",
    activeOld: "is-active--prev",
    time: 6500,
    noMobile: true
  });
  // Added the observer and run the slider 
  slide.observer().run()


  /** 
   * Instance and initialization of the class lightBox
   * handler of the Gallery' lightBox
   */

  let lb = new lightBox(".modal", '.modal-gallery')

  lb.init(".modal-close", ".prev-img", ".next-img", () => {

    const containerGallery = d.querySelector(".pictunex-gallery")
    containerGallery.addEventListener("click", ev => {
      if (ev.target.matches(".masonry-item figcaption")) {
        lb.load(ev.target, '.masonry-item[data-imgid]')
      }
    });
  });



  //Pagination's Controls
  d.querySelector(".container-px main").addEventListener("click", ev => {

    if (ev.target.matches(".btn-prev-c span")) {
      let element = ev.target.parentNode.parentNode.children[1]

      let offset = 1;
      if (innerWidth > 600) {
        offset = -4;
      }
      element.scrollLeft -= element.offsetWidth + offset;
    }
  });

  d.querySelector(".container-px main").addEventListener("click", ev => {

    if (ev.target.matches(".btn-next-c span")) {
      let element = ev.target.parentNode.parentNode.children[1]

      let offset = 1;
      if (innerWidth > 600) {
        offset = -4;
      }
      element.scrollLeft += element.offsetWidth + offset;
    }
  });


  d.querySelector(".pagination ul").addEventListener("click", ev => {
    const TAM = (44 * 2);

    if (ev.target.matches(".index-pag")) {
      const containerPag = d.querySelector(".pagination ul")

      let Lxi = containerPag.getBoundingClientRect().x - 5,
        Lxf = containerPag.getBoundingClientRect().x + TAM - 5

      let Rxf = (containerPag.getBoundingClientRect().x + containerPag.getBoundingClientRect().width),
        Rxi = Rxf - TAM * 1.2


      // Emulate prev-btn
      if (ev.target.getBoundingClientRect().x >= Lxi && ev.target.getBoundingClientRect().x <= Lxf) {
        console.log("Inicio X: ", Lxi)
        console.log("final X: ", Lxf)
        console.log(ev.target.getBoundingClientRect().x, ev.target.getBoundingClientRect().x)

        console.log("PREV")
        containerPag.scrollLeft -= (ev.target.getBoundingClientRect().width + 0) * 2

      }
      if (ev.target.getBoundingClientRect().x >= Rxi && ev.target.getBoundingClientRect().x <= Rxf) {
        // Emulate next-btn
        console.log("Inicio X: ", Rxi)
        console.log("final X: ", Rxf)
        console.log(ev.target.getBoundingClientRect().x, ev.target.getBoundingClientRect().x)

        console.log("NEXT")
        containerPag.scrollLeft += (ev.target.getBoundingClientRect().width + 0) * 2
      }
    }
  });

  d.querySelector("#show-search-box").addEventListener("click", ev => {
    const searchBoxNav = d.querySelector(".search-container")

    if (searchBoxNav.classList.contains("show")) {
      ev.target.classList.remove("fa-arrow-left")
      ev.target.classList.add("fa-search")

      searchBoxNav.classList.remove("show")

    } else {
      ev.target.classList.remove("fa-search")
      ev.target.classList.add("fa-arrow-left")

      searchBoxNav.classList.add("show")

    }

  });

  //menu 
  if (document.querySelector(".menu-main")) {
    btnHamburguer(".menu-main");
  }

}); // end <- addEventListener("load",()=>{})