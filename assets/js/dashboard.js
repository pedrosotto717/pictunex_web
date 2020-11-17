'use strict';

import admin from "../js/modules/admin.js";
import route from "../js/modules/handler-routes.js";
import controller from "../js/modules/controllers.js";


addEventListener("load", () => {
	let count = 0;

	/**
	 * Defined Controllers for Routes
	 */
	route.defineController("/home", controller.home)
	route.defineController("/search", controller.search)
	route.defineController("/images", controller.images)
	route.defineController("/upload", controller.upload)
	route.defineController("/logout", controller.logout)
	route.defineController("/profile", controller.profile)
	route.defineController("NOT_FOUND", controller.notFound)

	// btn hamburguer (controller for the main-menu)
	btnHamburguer(".menu-container");

	// Check if hash change for to load and render a new view
	window.addEventListener("hashchange", ev => {
		const hash = location.hash.substring(1)
		changeBtnActive()
		route.handler(hash, false)
	});

	//Check if the session Not Expired Or is invalid
	setInterval(() => {
		verifySession(false)
	}, 60000);


	const intervalVerifyUser = setInterval(() => {

		count++

		if (window.userData !== undefined) {
			//init admin's Object
			admin.init()

			// load in the HOME where start
			const h = location.hash.substring(1)
			route.handler(h, true)

			setTimeout(() => {
				//body loader remove
				changeBtnActive()
				document.body.classList.remove("loader")
			}, 500);

			// Clear Interval if (load UserDATA)
			clearInterval(intervalVerifyUser)
		} else if (count >= 25) {
			window.location.reload()
		}

	}, 800);

	document.getElementById("content").addEventListener("click", ev => {

		// FOR Edit the Images
		if (ev.target.matches(".edit-image") || ev.target.matches(".edit-image  .fa")) {
			let dataImage = null,
				$nodeParentImage = ev.target.parentNode.parentNode

			if ($nodeParentImage.matches(".gallery__item"))
				dataImage = JSON.parse($nodeParentImage.dataset.imgobj)
			else {
				$nodeParentImage = $nodeParentImage.parentNode
				dataImage = JSON.parse($nodeParentImage.dataset.imgobj)
			}

			controller.saveImage(dataImage, document.getElementById("container-form-edit"))
		}


		// For Delete a images
		else if (ev.target.matches(".delete-image") || ev.target.matches(".delete-image .fa")) {

			let $nodeParentImage = ev.target.parentNode.parentNode,
				dataImage = null

			if ($nodeParentImage.matches(".gallery__item"))
				dataImage = JSON.parse($nodeParentImage.dataset.imgobj)
			else {
				$nodeParentImage = $nodeParentImage.parentNode
				dataImage = JSON.parse($nodeParentImage.dataset.imgobj)
			}

			controller.delete($nodeParentImage, dataImage, document.getElementById("content"))
		}

	});

	function changeBtnActive() {
		document.querySelectorAll(".menu__item a").forEach((el, index) => {

			if (el.hash == location.hash)
				el.classList.add("btn--active")
			else if ((location.hash == "" || location.hash == "#" || location.hash == "#/") && index == 0)
				el.classList.add("btn--active")
			else
				el.classList.remove("btn--active")

		});
	}

	document.body.addEventListener("click", ev => {

		if (ev.target.matches(".profile__alias")) {
			document.querySelector(".profile").classList.toggle("is-active")
		} else {
			document.querySelector(".profile").classList.remove("is-active")
		}

		if (ev.target.matches(".gallery__item")) {
			const objImg = JSON.parse(ev.target.dataset.imgobj).src,
				imgId = ev.target.dataset.imgid



		}
	});

	let lb = new lightBox(".modal", '.modal-gallery', true)

	lb.init(".modal-close", ".prev-img", ".next-img", () => {

		const containerGallery = document.body

		containerGallery.addEventListener("click", ev => {

			if (ev.target.matches(".gallery__item")) {
				lb.load(ev.target, '.gallery__item')
			}
		});
	});


});