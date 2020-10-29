'use strict';

import api from "./interface-api-px.js";

const admin = {
	API: new api(config.getURL_API()),
	allImages: null,
	currentImages: null,
	pag: 0,	

	init(){
		this.loadCategories()
		.then( res =>{
			this.categoriesImg = res
			// console.log("THIS ",this)
		});

		this.allImages = []
		this.currentImages = []
		this.pag = 0
		
		this.user_id = ( window.userData ) !=undefined 
		? window.userData.user_id : sessionStorage.getItem("USER_ID")
	},

	/**
	* get all categories available on API
	*/
	async loadCategories(){
		const categories = await this.API.getCategories()
		sessionStorage.setItem("CATEGORIES", JSON.stringify(categories) );
		return categories
	},

	/**
	* get the images, only of the user 
	*/
	async loadAllImg($container = null){
		console.info('::USER_ID::',this.user_id)

		
		if(this.user_id==null || this.user_id==undefined || this.user_id.length==0){
			return 0;
		}

		const res = await this.API.getAll(this.user_id)
		console.log(res)

		if(res!=null && res.length > 0){
				this.allImages = res
				this.currentImages = this.allImages[this.pag]
		}

		return this.InsertInContainer($container, this.currentImages)
	},

	/**
	*	@param (category, $container) category, Node Container for insert to result
	*/
	async loadByCategories(category, $container = null){

		if(this.user_id==null || this.user_id==undefined || this.user_id.length==0){
			return 0;
		}
		
		const res = await this.API.getByCategory(category, this.user_id)
		console.log(res)

		if(res!=null && res.length > 0){
				this.allImages = res
				this.currentImages = this.allImages[this.pag]
		}else if (res === null || res.length===0) {
			return 0
		}

		return this.InsertInContainer($container, this.currentImages)
	},

	/**
	*	@param (Key, $container <- $gallery) Search, Node Container for insert to result
	*/
	async loadBysearch(keyW, $container = null){

		if(this.user_id==null || this.user_id==undefined || this.user_id.length==0){
			return 0;
		}

		//FLAG LETTERS, ESPECIALS CHARS
		
		const res = await this.API.search(keyW, this.user_id)
		console.log(res)

		if(res!=null && res.length > 0){
				this.allImages = res
				this.currentImages = this.allImages[this.pag]
		}else if (res === null || res.length===0) {
			return 0
		}

		return this.InsertInContainer($container, this.currentImages)
	},


	async InsertInContainer($container, arrImages = this.currentImages){
		if(arrImages.length === 0){
			return 0;
		}

		const $containerFrag = document.createDocumentFragment()

		//here the array of images Current
		arrImages.forEach( (el,index) =>{
			const userName = ( window.userData ) !=undefined 
			? window.userData.username : null;

			if(el.nickname == userName){
				const $tplImgItem = `
				<div class="gallery__item__controls">

			        <button class="edit-image">
			            <span class="fa fa-pen"></span>
			        </button>

			        <button class="delete-image">
			            <span class="fa fa-delete"></span>
			        </button>

			        <a class="download-image" href="${el.src}" title="Download Image" class="btn-icon" download target="_blank" rel="nofollow">
						<span class="download-icon icon"></span>
					</a>

			    </div>

			    <img class="image" src="${el.src}" alt="Image">
					`;

				// add the content in TPL to container item
				const $containerItem = document.createElement("div")
				$containerItem.classList.add("gallery__item")

				$containerItem.innerHTML = $tplImgItem
				$containerItem.setAttribute("data-imgId", index)

				$containerItem.setAttribute("data-imgobj",JSON.stringify( this.subObjectImg(el,index) ))


				// add the containerItem To the fragment
				$containerFrag.appendChild($containerItem)
			}
			
		});

		// add the fragment To the containerMain
		$container.append($containerFrag)
		return $container;
	},

	subObjectImg(obj,id){
		return {
			name: obj.name,
			nickname: obj.nickname,
			src: obj.src,
			categories: obj.categories.split(","),
			id
		}
	}

}

export default admin;