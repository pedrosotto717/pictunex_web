/*
 * class SlidePX | slider from header in index.html
 */

export default class SlidePX{

  constructor(slide){ 
    this.slideContainer = document.querySelector(slide.container) 
    this.slideItems = Array.from(document.querySelectorAll(slide.items))
    this.classActive = slide.active
    this.classActiveOld = slide.activeOld
    this.currenItem = this.slideItems[0]
    this.timeOut = slide.time
    this.ready = true
    this.noMobile = slide.noMobile || false
  }


  run(){
    this.animationInterval = setInterval( () => {

      if(this.ready && !this.isMobile()){

        this.ready = false

        this.nextSlide(()=>{
          this.ready = true
          if(this.noMobile)
            this.isMobile()
        });
      }
    },this.timeOut);
  }


  nextSlide(callback){
    
    this.resetClassActive()
    this.currenItem.classList.add(this.classActiveOld)
    this.currenItem = this.whoKeepsOn()
    this.currenItem.classList.add(this.classActive)

    setTimeout(()=>{
      this.resetClassActiveOld()
      callback()
    },this.timeOut / 2);

  }


  observer(){
    document.addEventListener("visibilitychange", ev =>{
      document.visibilityState==="hidden" ? this.stop() : this.run()
    });

    const observer = new IntersectionObserver((entries)=>{
      entries[0].isIntersecting === true  ?  this.ready = true : this.ready = false
    })

    observer.observe(this.slideContainer)
    return this
  }


  whoKeepsOn(){
    const current = this.slideItems.indexOf(this.currenItem)

    if(current < this.slideItems.length-1) //5- 1 = 4
      return this.slideItems[current + 1]
    else if(current == this.slideItems.length-1)
      return this.slideItems[0]
  }


  isMobile(){
    if(window.innerWidth <= 600){
      console.log(":STOP:")
      this.stop()
      return true;
    }
    return false
  }


  resetClassActive(){
    this.slideItems.forEach( e => e.classList.remove(this.classActive))
  }


  resetClassActiveOld(){
    this.slideItems.forEach( e =>{
      if(e !== this.currenItem)
        e.classList.remove(this.classActiveOld);
    })
  }


  stop(){
    clearInterval(this.animationInterval)
    console.log("Stoped")
    return 0
  }
}