function scrollToTop(elem) {
    let elemButton = document.querySelector(elem);

	document.addEventListener('scroll',() => {
    const limit = window.innerHeight + 100;

    window.pageYOffset > limit 
      ? elemButton.classList.remove('hide')
      : elemButton.classList.add('hide');      
  });


  document.addEventListener('click', e =>{
    if(e.target.matches('.btnToTop') || e.target.matches('.btnToTop span'))
      window.scrollTo({
        behavior: "smooth",
        top:0
      });
  });

}

scrollToTop('.btnToTop');