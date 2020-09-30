
class lightBox{

	constructor(containerGallery, containerModal){
		this.error = false
		this.currentImg = -1;
		this.container = document.querySelector(containerGallery)
		this.containerLB = document.querySelector(containerModal)
	}


	init(btnClose,btnPrev,btnNext,callback){ // modal-close 
		btnClose = typeof btnClose == "string" ? document.querySelector(`${btnClose}`) : btnClose
		btnPrev = typeof btnPrev == "string" ? document.querySelector(`${btnPrev}`) : btnPrev
		btnNext = typeof btnNext == "string" ? document.querySelector(`${btnNext}`) : btnNext


		btnClose.addEventListener("click", ev =>{
			this.disableLB()
		});

		btnPrev.addEventListener("click", ev =>{
			this.prev()
		});
		
		btnNext.addEventListener("click", ev =>{
			this.next()
		});

		if(typeof callback == "function")
			callback()
	}


	load(el,listItems){
		this.listGalleryElements = document.querySelectorAll(listItems) 
		const obj = this.subObj(el)
		this.loadView(obj)
		this.activeLB()
	}

	prev(){
		if( (this.currentImg - 1) >= 0){
			this.currentImg--
		}else{
			this.currentImg = this.listGalleryElements.length-1
		}
		const element = this.findElementById()
		console.log(element)
		const obj = this.subObj(element)
		this.loadView(obj)
	}

	next(){
		if( (this.currentImg + 1) < this.listGalleryElements.length){
			this.currentImg++
			console.log("yes")
		}else{
			this.currentImg = 0
		}
		const element = this.findElementById(this.currentImg)
		const obj = this.subObj(element)
		this.loadView(obj)
	}


	findElementById(){
		const next = document.querySelector(`[data-imgid="${this.currentImg}"] .masonry-details`)
		console.log("AQUI", next, this.currentImg)
		return next
	}


	subObj(el){
		let objInString = el.dataset.imgobj
		let parseObj =  typeof objInString == "string" ? JSON.parse(objInString) : null
		if(typeof parseObj === "object")
			return parseObj
		else if(parseObj != null)
			return JSON.parse( parseObj )
		else
			return false
	}


	loadView(obj){

		if(typeof obj === "object" && obj !== null){
			let $img = this.containerLB.querySelector('.view-box-img img'),
			$nickname = this.containerLB.querySelector('.nickname'),
			$categories = this.containerLB.querySelector('.categories ul'),
			$a = this.containerLB.querySelector('.download-img a')
	
			$img.src = obj.src
			$img.alt = obj.name
			$nickname.textContent = obj.nickname
			$a.href = obj.src

			$categories.innerHTML = ""
	
			obj.categories.forEach( (c) => {
				let $li = document.createElement('li')
				$li.classList.add('mark-c')
				let $a = `<a href="#${c}">${c}</a>`
				$li.insertAdjacentHTML("afterbegin",$a)
				$categories.appendChild($li)
			});

			console.log("setID", obj.id)
			this.currentImg = obj.id
		}else
			this.error = true
	}


	activeLB(){
		if( this.error === false){
			this.container.classList.add("active")
			console.log('active')
		}else
			this.error = false
	}


	disableLB(){
		this.container.classList.remove("active")
	}
}