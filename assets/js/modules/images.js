/*
 * class Images < InterfaceApiPX | connect whit API-PX and insert In DOM
 */
import InterfaceApiPX from "./interface-api-px.js"

export default class Images extends InterfaceApiPX{

	constructor(config){
		super(config.url)
		this.allImages = []
		this.allCurrentImages = []
		this.containerGallery = document.querySelector(config.container)
		this.pag = localStorage.getItem("CURRENT_PAG") || 0; //!-
		this.keyOldSearch = null
		this.currentCategory = "all"
		this.containerCategories = null
	}

	async initCategories(container,callback){
		let categories = {}
		if(typeof localStorage.getItem("CATEGORIES") === "string"){
			categories = JSON.parse(localStorage.getItem("CATEGORIES"))
		}else{
			categories = await this.getCategories()
			localStorage.setItem("CATEGORIES", JSON.stringify(categories))
		}

		this.containerCategories = document.querySelector(container)
		const $fragment = document.createDocumentFragment()

		categories.categories.unshift("all")
		
		categories.categories.forEach( (el, index) => {
			const $li = document.createElement("li"),
				  $a = `<a class="categories" href="#${el}">${el}</a>`

			if(index==0)
				$li.classList.add("btn--active-c")
			$li.classList.add("btn-main")
			$li.insertAdjacentHTML("beforeend", $a)
			$li.style.color = "#000"
			$li.setAttribute("data-numc",index)
			$fragment.appendChild($li)
		});

		this.containerCategories.appendChild($fragment)

		if(typeof callback == "function")
			callback(this.containerCategories)
	}

	/**
	 * Get All images 
	 */
	async loadAll(callback = null,reset = false){
		if(typeof localStorage.getItem("ALL_IMG") === "string"){
			const res = JSON.parse(localStorage.getItem("ALL_IMG"))
			if(typeof res === "object"){
				this.allImages = res
				this.allCurrentImages = this.allImages[this.pag]
				console.log("LOCAL_STORAGE")
			}
		}else{
			const res = await this.getAll()
			if(res!=null && res.length > 0){
				this.allImages = res
				this.allCurrentImages = this.allImages[this.pag]
				localStorage.setItem("ALL_IMG",JSON.stringify(res))
				console.log("NETWORK")
			}
		}

		if(reset){
			this.restartContainer()
			this.insertInDOM(this.allCurrentImages)
			this.runMasonry()
		}else{
			this.insertInDOM(this.allCurrentImages)
		}

		if(typeof callback == "function")
			callback()
	}

	/**
	 * Get images By Category
	 */
	async loadByCategory(category,callback = null, objAux = null){

		if(category.length == 0) return false

		if(this.currentCategory != category){
			
			if(category == "all"){
				return this.loadAll(()=>{
					this.currentCategory = category
					this.clearListCategories(objAux.num)
				},true);
			}

			if(typeof localStorage.getItem(category) === "string"){
				const res = JSON.parse(localStorage.getItem(category))
				if(typeof res === "object"){
					console.log("LOCAL_STORAGE")
					this.allImages = res
					this.allCurrentImages = this.allImages[this.pag]
				}
			}else{
				const res = await this.getByCategory(category)
				if(res!=null && res.length > 0){
					console.log("NETWORK")
					this.allImages = res
					this.allCurrentImages = this.allImages[this.pag]
					localStorage.setItem(category,JSON.stringify(res))
				}
			}

			this.currentCategory = category
			this.restartContainer()
			this.insertInDOM(this.allCurrentImages)
			this.runMasonry()
	
			if(typeof callback == "function")
				callback()
		}
		
	}


	/**
	 * Search
	 */
	async loadSearch(key, callback = null){

		if(key.length == 0) return false
		key = key.replaceAll(/[\@\#\\\-\¡\º\!\|*?¿+-+_+:;+=+>+<\{}\[\]\.+,+``´´\/\'\"\+^\¨]/gi,"")

		this.clearListCategories()
		
		if(key != this.keyOldSearch){
			if(typeof localStorage.getItem(key) === "string"){
				const res = JSON.parse(localStorage.getItem(key))
				if(typeof res === "object"){
					console.log("LOCAL_STORAGE")
					this.allImages = res
					this.allCurrentImages = this.allImages[this.pag]
				}
			}else{
				const res = await this.search(key)
				if(res!=null && res.length > 0){
					console.log("NETWORK")
					this.allImages = res
					this.allCurrentImages = this.allImages[this.pag]
					localStorage.setItem(key,JSON.stringify(res))
				}else{
					this.keyOldSearch = ""
					return this.notFound(key)
				}
			}
	
			// console.log(this.allCurrentImages)
			this.restartContainer()
			this.insertInDOM(this.allCurrentImages)
			this.runMasonry()
			this.keyOldSearch = key
	
			if(typeof callback == "function")
				callback()
		}
	}


	/**
	 * Method to Insert Elements In DOM
	 */
	insertInDOM(arrElem){

		const $fragment = document.createDocumentFragment()
		arrElem.forEach( (el,index) => {
			const $content = `<figure>
							<img src="${el.src}" alt="${el.name} - Pixtunex Image">
							<figcaption class="masonry-details">

							<header class="user">${el.nickname}</header>
							<footer>
								<span class="logo-px icon"></span>
								<a href="${el.src}" title="Download Image" class="btn-icon" download target="_blank" rel="nofollow">
									<span class="download-icon icon"></span>
								</a>
							</footer>

								</figcaption>
						   </figure>`;

			const $containerItem = document.createElement('div')
			$containerItem.classList.add('masonry-item')
			$containerItem.setAttribute("data-imgId", index)

			$containerItem.insertAdjacentHTML('beforeend', $content)


			$containerItem.querySelector(".masonry-details").setAttribute("data-imgobj",JSON.stringify( this.subObjectImg(el,index) ))
			$fragment.appendChild($containerItem)
		});
		this.containerGallery.appendChild($fragment)
	}


	/**
	 * Methods Auxs
	 */

	subObjectImg(obj,id){
		return {
			name: obj.name,
			nickname: obj.nickname,
			src: obj.src,
			categories: this.parseCategories(obj.categories),
			id
		}
	}

	parseCategories(categories){
		return categories.split(",")
	}

	restartContainer(){
		this.containerGallery.innerHTML = ""
		this.containerGallery.classList.remove("active")
	}

	runMasonry(){
		setTimeout(()=>{
	    	msr('.masonry-layout', '.masonry-item', 100)
		},1000)
	}

	notFound(key){
		const msg = `<div class="no-coincidence">
						<p>No Coincidence with "<span>${key}</span>"</p>
					</div>`
		this.restartContainer()
		this.containerGallery.innerHTML = msg
	}

	clearListCategories(n = null){
		
		if(this.containerCategories.querySelector('.btn--active-c') != null)
			this.containerCategories.querySelector('.btn--active-c').classList.remove("btn--active-c") 

		if(n != null)
			this.containerCategories.querySelector(`[data-numc="${n}"]`).classList.add("btn--active-c") 
		else
			this.currentCategory = " "
	}

}

