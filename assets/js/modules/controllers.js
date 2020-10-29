'use strict';

import admin from "./admin.js";


const controllers = {

    // container: document.getElementById("content"),

    async home($container){
        $container.innerHTML = `<h1>__HOME__CONTROLLERS__</h1>`
    },

    async search($container){
        const $searchBar = document.createElement("div"),
        	  $gallery = document.createElement("div")

       	$searchBar.classList.add("search-container")
        $searchBar.insertAdjacentHTML("beforeend",`
        <form id="search" class="formSearch search-box transparent">
            <input id="inputSearch" type="search" class="search-input" name="search"  placeholder="Search" autocomplete="off">   
            <button type="reset"><span class="fa fa-times"></span></button>
            <button type="submit"><span class="fa fa-search"></span></button>
        </form>`);


        $gallery.classList.add("gallery")

        $container.innerHTML = ""
        $container.appendChild($searchBar)
        $container.appendChild($gallery)

        document.getElementById("search")
        .addEventListener("submit", async ev => {

        	ev.preventDefault()

        	const keyWord = ev.target.inputSearch.value
        	console.clear()
        	console.log(keyWord)

            try {
				
				$gallery.innerHTML = ""
            	const searchResult = await admin.loadBysearch(keyWord,$gallery);

                if(searchResult === 0){
	                $gallery.innerHTML = `<h3>NO MATCHES</h3>`
	            }

            } catch(e) {
                // statements
                console.log(e);
            }
        });
    },

    async images($container){
        
        if(true){
            try {
                const $contentIMAGE = `
                    <form>
                        <select name="filter-img" id="filter_images" value="all">
                            <option value="all">all</option>
                        </select>
                    </form>
                    `;

                const $containerImages  = document.createElement("div"),
                      $gallery = document.createElement("div")

                $containerImages.insertAdjacentHTML("beforeend", $contentIMAGE)
                $containerImages.classList.add("container-gallery")

                $gallery.classList.add("gallery")

                /**
                  * get all images and the insert in ContainerImages 
                  */
                const load = await admin.loadAllImg($gallery)
                console.warn(load)

                if(load===0){
                    $gallery.innerHTML = `
                                <h3>0 Images Uploaded</h3>

                                <div class="u-btn">
                                    <a class="btn btn-up" href="#/upload">
                                        <span class="fa fa-upload"></span>
                                        Upload Images
                                    </a>
                                </div>
                                `;
                }

                //insert in contentIMAGE the galleryContainer
                $containerImages.appendChild($gallery)
                
                $container.innerHTML = "";


                // insert TPL in DOM
                $container.appendChild($containerImages)

                const filterImg = document.getElementById("filter_images")
                const category =  [...JSON.parse(sessionStorage.CATEGORIES).categories]
                
                console.log(category)

                category.forEach( (el, index) => {
                    const op = document.createElement("option")
                    op.setAttribute("value", el)
                    op.textContent = el
                    filterImg.appendChild(op)
                });


                filterImg.addEventListener("change", async ev => {
                    console.log(ev.target.value)

                    if(ev.target.value === "all"){
                        $gallery.innerHTML = ""
                        const load = await admin.loadAllImg($gallery)
                        console.warn(load)

                        if(load===0){
                            $gallery.innerHTML = `
                                        <h3>0 Images Uploaded</h3>

                                        <div class="u-btn">
                                            <a class="btn btn-up" href="#/upload">
                                                <span class="fa fa-upload"></span>
                                                Upload Images
                                            </a>
                                        </div>
                                        `;
                        }
                    }else{
                        $gallery.innerHTML = ""
                        const categoriesImg = await admin.loadByCategories(ev.target.value,$gallery)
                        if(categoriesImg === 0){
                            $gallery.innerHTML = `<h3>NO MATCHES</h3>`
                        }
                        // code for get imgs for category
                        console.log("FLAG", categoriesImg)
                    }
                });


            } catch(e) {
                const lhref = location.href.split("#")[0]
                console.log(lhref)
                window.location.replace(lhref)
                console.log(e);
                return 0;
            } finally{
                return 0;
            }
        }// end <- if

    },
    
    async upload($container){
        $container.innerHTML = `<h1>__UPLOAD__CONTROLLERS__</h1>`
    },
    
    async logout($container){
        $container.innerHTML = `<h1>__LOGOUT__CONTROLLERS__</h1>`
        localStorage.clear()
        sessionStorage.clear()
        location.href = "../login.html"
    },

    notFound(){
        console.log("NOT_FOUND")
    }


}

export default controllers;


/*container.innerHTML = `<h1>__IMAGES__CONTROLLERS__</h1>

<div class="container-gallery">
    <form>
        <legend>Filter Images</legend>
        <option value="">
            <select name="" id=""></select>
        </option>
    </form>

    <div class="gallery">

    
    </div>
</div>


`;*/