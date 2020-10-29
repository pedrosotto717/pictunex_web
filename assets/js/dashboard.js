'use strict';

import admin from "../js/modules/admin.js";
import route from "../js/modules/handler-routes.js";
import controller from "../js/modules/controllers.js";

admin.init()

addEventListener("load",()=>{
	/**
	 * Defined Controllers for Routes
	 */
	route.defineController("/home",controller.home)
	route.defineController("/search",controller.search)
	route.defineController("/images",controller.images)
	route.defineController("/upload",controller.upload)
	route.defineController("/logout",controller.logout)
	route.defineController("NOT_FOUND",controller.notFound)
	
	// btn hamburguer (controller for the main-menu)
	btnHamburguer(".menu-container");

	// load in the HOME where start
	const h = location.hash.substring(1)
	route.handler(h,true)

	// Check if hash change for to load and render a new view
	window.addEventListener("hashchange", ev => {
		const hash = location.hash.substring(1)
		// document.querySelector(".content").innerHTML = hash
		route.handler(hash,false)
	});

	//Check if the session Not Expired Or is invalid
	setInterval(()=>{
		verifySession(false)
	},60000);


	document.body.addEventListener("click", ev => {
		// admin.loadAllImg(document.body.querySelector("#content"))
	});
});