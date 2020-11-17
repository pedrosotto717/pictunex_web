'use strict';

import api from "./interface-api-px.js";

const admin = {
	API: new api(config.getURL_API()),
	allImages: null,
	currentImages: null,
	pag: 0,

	init() {
		this.loadCategories()
			.then(res => {
				this.categoriesImg = res
			});

		this.allImages = []
		this.currentImages = []
		this.pag = 0

		this.user_id = (window.userDatata) != undefined
			? window.userData.user_id : sessionStorage.getItem("USER_ID")
	},

	initPagination(container, callback = null) {

		const containerPagination = document.querySelector(container)
		containerPagination.innerHTML = "";

		if (this.allImages.length > 0) {

			if (this.allImages.length == 1) {
				containerPagination.innerHTML = "";
				return 0
			}


			this.allImages.forEach((el, index) => {
				const $li = document.createElement("li")

				$li.insertAdjacentHTML("beforeend", `
					<button class="index-pag ${index == 0 ? "active" : ""}" data-pag="${index}">${index + 1}</button>
				`)

				containerPagination.appendChild($li)
			});

			if (typeof callback == "function")
				callback(containerPagination, this)
		}
	},

	pagination($gallery) {
		this.pag = 0;
		this.initPagination(".pagination ul", (containerPagination, self) => {

			containerPagination.addEventListener("click", async ev => {

				if (ev.target.matches(".index-pag")) {
					ev.preventDefault()
					const value = parseInt(ev.target.dataset.pag)

					if (value != self.pag) {
						self.pag = value
						sessionStorage.setItem("CURRENT_PAG", self.pag)

						// clear class active from elements .index-pag
						containerPagination.querySelectorAll(".index-pag").forEach(el => {
							el.classList.remove("active")
						});

						// set class active to Element active 
						ev.target.classList.add("active")
						self.currentImages = self.allImages[self.pag]
						$gallery.innerHTML = ""
						const load = await this.InsertInContainer($gallery)
					}
				}
				const TAM = (44 * 2);

				if (ev.target.matches(".index-pag")) {
					const containerPag = document.querySelector(".pagination ul")

					let Lxi = containerPag.getBoundingClientRect().x - 5,
						Lxf = containerPag.getBoundingClientRect().x + TAM - 5

					let Rxf = (containerPag.getBoundingClientRect().x + containerPag.getBoundingClientRect().width),
						Rxi = Rxf - TAM * 1.2


					if (ev.target.getBoundingClientRect().x >= Lxi && ev.target.getBoundingClientRect().x <= Lxf) {

						// Emulate prev-btn
						containerPag.scrollLeft -= (ev.target.getBoundingClientRect().width + 0) * 2
					}
					if (ev.target.getBoundingClientRect().x >= Rxi && ev.target.getBoundingClientRect().x <= Rxf) {

						// Emulate next-btn
						containerPag.scrollLeft += (ev.target.getBoundingClientRect().width + 0) * 2
					}
				}
			}); // callback Listenner
		}); // end initpagination
	},


	/**
	* get all categories available on API
	*/
	async loadCategories() {
		const categories = await this.API.getCategories()
		sessionStorage.setItem("CATEGORIES", JSON.stringify(categories));
		return categories
	},

	/**
	* get the images, only of the user 
	*/
	async getLastFiveimages(num) {
		const Arr = []
		const res = await this.API.getAll(this.user_id)

		if (res != null && res.length > 0) {
			res[0].forEach((el, index) => {
				if (index < num) {
					Arr.push(el)
				}
			});

			return Arr;
		} else {
			return false;
		}
	},

	async loadAllImg($container = null) {
		if (this.user_id == null || this.user_id == undefined || this.user_id.length == 0) {
			return 0;
		}

		const res = await this.API.getAll(this.user_id)

		if (res != null && res.length > 0) {
			this.pag = 0
			this.allImages = res
			this.currentImages = this.allImages[this.pag]
		}

		// this.initPagination(".pagination ul")
		return this.InsertInContainer($container, this.currentImages)
	},

	/**
	*	@param (category, $container) category, Node Container for insert to result
	*/
	async loadByCategories(category, $container = null) {

		if (category.length == 0) return false
		category = category.replace(/[\@\#\\\-\¡\º\!\|*?¿+-+_+:;+=+>+<\{}\[\]\.+,+``´´\/\'\"\+^\¨]/gi, "")
		category = category.toLowerCase()


		if (this.user_id == null || this.user_id == undefined || this.user_id.length == 0) {
			return 0;
		}

		const res = await this.API.getByCategory(category, this.user_id)

		if (res != null && res.length > 0) {
			this.pag = 0
			this.allImages = res
			this.currentImages = this.allImages[this.pag]
		} else if (res === null || res.length === 0) {
			return 0
		}

		return this.InsertInContainer($container, this.currentImages)
	},

	/**
	*	@param (Key, $container <- $gallery) Search, Node Container for insert to result
	*/
	async loadBysearch(keyW, $container = null) {

		if (keyW.length == 0) return false
		keyW = keyW.replace(/[\@\#\\\-\¡\º\!\|*?¿+-+_+:;+=+>+<\{}\[\]\.+,+``´´\/\'\"\+^\¨]/gi, "")
		keyW = keyW.toLowerCase()

		if (this.user_id == null || this.user_id == undefined || this.user_id.length == 0) {
			return 0;
		}

		//FLAG LETTERS, ESPECIALS CHARS

		const res = await this.API.search(keyW, this.user_id)

		if (res != null && res.length > 0) {
			this.pag = 0
			this.allImages = res
			this.currentImages = this.allImages[this.pag]
		} else if (res === null || res.length === 0) {
			return 0
		}

		return this.InsertInContainer($container, this.currentImages)
	},


	async InsertInContainer($container, arrImages = this.currentImages) {
		if (arrImages.length === 0) {
			return 0;
		}

		const $containerFrag = document.createDocumentFragment()

		//here the array of images Current
		arrImages.forEach((el, index) => {
			const userName = (window.userData) != undefined
				? window.userData.username : null;

			if (el.nickname == userName) {
				const $tplImgItem = `
				<div class="gallery__item__controls">

			        <button class="edit-image">
			            <span class="fa fa-pen"></span>
			        </button>

			        <button class="delete-image">
			            <span class="fa fa-trash-alt"></span>
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

				$containerItem.setAttribute("data-imgobj", JSON.stringify(this.subObjectImg(el, index)))


				// add the containerItem To the fragment
				$containerFrag.appendChild($containerItem)
			}

		});

		// add the fragment To the containerMain
		$container.append($containerFrag)
		return $container;
	},

	async uploadImage(form, actionParam, idimg = null) {
		try {
			const formDataEnc = new FormData()

			const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN") || false;

			if (ACCESS_TOKEN === false) {
				localStorage.clear()
				throw new Error("TOKEN INVALID NOT_EXIST")
				return false
			}

			const JWT = "Bearer " + ACCESS_TOKEN;

			const headers = new Headers()
			headers.append("AUTHORIZATION-TOKEN", JWT)

			let categoriesArr = [...form.querySelectorAll(".tag__item input:checked")]
				.filter(el => {
					if (el.checked)
						return el
				})
				.map(el => el.value)

			let categoriesString = this.putC(categoriesArr);

			if (actionParam == "create")
				formDataEnc.append("action", "create")

			formDataEnc.append("name", form.name_img.value)
			formDataEnc.append("keywords", form.keywords.value.replace('-', ' '))
			formDataEnc.append("categories", categoriesString)
			formDataEnc.append("src", form.images_file.files[0] == undefined ? null : form.images_file.files[0])

			let response = null

			if (actionParam === "create") {
				response = await fetch(config.getURL_API() + "/images", {
					method: "POST",
					body: formDataEnc,
					headers
				});
			} else if (actionParam === "update") {
				response = await fetch(config.getURL_API() + `/images/update/${idimg || false}`, {
					method: "POST",
					body: formDataEnc,
					headers
				});
			}

			if (response.status === 201) {
				const responseParse = await response.json()
				if (responseParse.code == 201)
					return true;
			}
			return false;

		} catch (e) {
			console.log(e);
		}

	},

	async deleteIMG(idX) {
		const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN") || false;

		if (ACCESS_TOKEN === false) {
			localStorage.clear()
			throw new Error("TOKEN INVALID NOT_EXIST")
			return false
		}

		const JWT = "Bearer " + ACCESS_TOKEN;

		const headers = new Headers()
		headers.append("AUTHORIZATION-TOKEN", JWT)

		const response = await fetch(config.getURL_API() + `/images/delete/${idX}`, {
			method: "DELETE",
			headers
		});

		if (response.status === 200) {
			const responseParse = await response.json()

			if (responseParse.code === 200) {
				return true;
			}
		}
		return false;

	},

	async updateUser($form, $image) {

		const formData = new FormData($form)

		let passWord = formData.get("oldPassword").length >= 8
			? formData.get("oldPassword") : 0;
		let newPassWord = formData.get("password").length >= 8
			? formData.get("password") : 0;


		if (newPassWord !== 0 && passWord !== 0) {
			passWord = await crypter.sha256(passWord)
			newPassWord = await crypter.sha256(newPassWord)
		} else passWord = 0

		const newUser = {
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			userName: $form.username.value,
			passWord: passWord,
			newPassword: newPassWord
		}

		const json_enc = crypter.base64Enc(JSON.stringify(newUser)),
			final = new FormData()

		final.append("user", json_enc)
		final.append("ico", $image)

		const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN") || false;

		if (ACCESS_TOKEN === false) {
			localStorage.clear()
			throw new Error("TOKEN INVALID NOT_EXIST")
			return false
		}

		const JWT = "Bearer " + ACCESS_TOKEN;

		const headers = new Headers()
		headers.append("AUTHORIZATION-TOKEN", JWT)

		const response = await fetch(config.getURL_API() + `/auth/update/`, {
			method: "POST",
			body: final,
			headers
		});

		if (response.status === 200) {
			const responseParse = await response.json()

			if (responseParse.code === 200) {
				return true;
			}
		}
		return false;



	},

	subObjectImg(obj, idx) {
		return {
			name: obj.name,
			nickname: obj.nickname,
			src: obj.src,
			categories: obj.categories.split(","),
			keywords: obj.keywords,
			id: obj.id,
			idPag: idx
		}
	},

	putC(arr) {
		let cad = "";

		arr.forEach((el, index) => {
			if (index != arr.length - 1) {
				cad += el + ",";
			} else {
				cad += el;
			}
		})
		return cad;
	}

}

export default admin;