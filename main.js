import slidePX from "./assets/js/modules/slide-px.js"

const slide = new slidePX({
  container: ".slide",
  items: ".slide__item",
  active: "is-active",
  activeOld: "is-active--prev",
  time: 6000,
  noMobile: true
})

slide.observer().run()

document.querySelector(".btn-menu").addEventListener("click", ev =>{
	console.log("Active")
	document.querySelector(".menu-main").classList.toggle("is-active-menu")
})




