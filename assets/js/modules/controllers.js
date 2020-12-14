'use strict';

import admin from "./admin.js";


const controllers = {

    // container: document.getElementById("content"),

    async home($container) {
        $container.innerHTML = `
        <div class="dialog_w">
            <h2 class="welcome_message"> 
            Hi
                <span class="name_user">${window.userData.first_name},</span>
                <span>Welcome Back</span>
            </h2>
            <p class="dialog_question">How about a review of your Images?</p>
        </div>

        `;

        const arrImages = await admin.getLastFiveimages(5)
        // console.clear()
        if (arrImages.length > 0) {

            $container.insertAdjacentHTML("beforeend", `
            <div class="slide_last_images">
                        
                <button class="prev">
                    <span class="fa fa-caret-left"></span>
                </button>

                <div class="slide_container">

                </div>

                <button class="next">
                    <span class="fa fa-caret-right"></span>
                </button>
            </div>
             `);

            arrImages.forEach((el, index) => {
                const a = `<figure class="slide__item">
                            <img src="${el.src}" alt="">
                            <figcaption></figcaption>
                        </figure>`;
                $container.querySelector(".slide_container").insertAdjacentHTML("beforeend", a)
            });

            const containerImages = $container.querySelector(".slide_container"),
                item = $container.querySelector(".slide__item")

            $container.querySelector(".prev").addEventListener("click", ev => {
                ev.preventDefault()

                containerImages.scrollLeft -= item.getBoundingClientRect().width + 16

                containerImages.off
            });

            $container.querySelector(".next").addEventListener("click", ev => {
                ev.preventDefault()

                containerImages.scrollLeft += item.getBoundingClientRect().width + 16

                containerImages.off
            });

            addEventListener("resize", ev => {
                containerImages.scrollLeft = 0
            });

        } else {
            $container.querySelector(".dialog_question").textContent = "0 Images Uploaded"
        }

        setTimeout(() => {

            if (arrImages.length > 0) {
                $container.querySelector(".slide_last_images").classList.add("is-active")
            } else {
                $container.querySelector(".dialog_w").insertAdjacentHTML("beforeend", `
                        <div class="u-btn">
                            <a class="btn btn-up" href="#/upload">
                                <span class="fa fa-upload"></span>
                                Upload Images
                            </a>
                        </div>
                        `);
            }

        }, 8000)


    },

    async search($container) {
        const $searchBar = document.createElement("div"),
            $gallery = document.createElement("div")

        $searchBar.classList.add("search-container")
        $searchBar.insertAdjacentHTML("beforeend", `
        <form id="search" class="formSearch search-box transparent">
            <input id="inputSearch" type="search" class="search-input" name="search"  placeholder="Search" autocomplete="off" minlength="1">   
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

                try {

                    $gallery.innerHTML = ""
                    const searchResult = await admin.loadBysearch(keyWord, $gallery);

                    if (searchResult === 0) {
                        $gallery.innerHTML = `<h3>NO MATCHES</h3>`
                    }

                } catch (e) {
                    // statements
                    console.log(e);
                }
            });
    },

    async images($container) {

        if (true) {
            try {
                const $contentIMAGE = `
                    <form>
                        <select name="filter-img" id="filter_images" value="all">
                            <option value="all">all</option>
                        </select>
                    </form>
                    `;

                const $containerImages = document.createElement("div"),
                    $gallery = document.createElement("div")

                $containerImages.insertAdjacentHTML("beforeend", $contentIMAGE)
                $containerImages.classList.add("container-gallery")

                $gallery.classList.add("gallery")

                /**
                  * get all images and the insert in ContainerImages 
                  */
                const load = await admin.loadAllImg($gallery)
                console.warn(load)

                if (load === 0) {
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
                $container.insertAdjacentHTML("beforeend", `
                <div class="container-pagination">
                    <div class="pagination controller-container-h">
                        <ul>
        
                        </ul>
                    </div>
                </div>
                `);

                admin.pagination($gallery)

                const filterImg = document.getElementById("filter_images")
                const category = [...JSON.parse(sessionStorage.CATEGORIES).categories]

                category.forEach((el, index) => {
                    const op = document.createElement("option")
                    op.setAttribute("value", el)
                    op.textContent = el
                    filterImg.appendChild(op)
                });


                filterImg.addEventListener("change", async ev => {

                    if (ev.target.value === "all") {
                        $gallery.innerHTML = ""
                        const load = await admin.loadAllImg($gallery)
                        console.warn(load)

                        if (load === 0) {
                            $gallery.innerHTML = `
                                        <h3>0 Images Uploaded</h3>

                                        <div class="u-btn">
                                            <a class="btn btn-up" href="#/upload">
                                                <span class="fa fa-upload"></span>
                                                Upload Images
                                            </a>
                                        </div>
                                        `;
                            // filter_images.style.dispaly
                        }
                    } else {
                        $gallery.innerHTML = ""
                        const categoriesImg = await admin.loadByCategories(ev.target.value, $gallery)
                        if (categoriesImg === 0) {
                            $gallery.innerHTML = `<h3>NO MATCHES</h3>`
                        }
                        // code for get imgs for category
                        admin.pagination($gallery)
                    }
                });


            } catch (e) {
                const lhref = location.href.split("#")[0]
                window.location.replace(lhref)
                return 0;
            } finally {
                return 0;
            }
        }// end <- if

    },

    async upload($container) {
        const $uploadContainer = document.createElement("div"),
            $form = document.createElement("form"),
            $tags = document.createElement("div"),
            $container_details = document.createElement("div")

        $uploadContainer.classList.add("form_container_upload")
        $form.setAttribute("id", "upload_image")
        $tags.classList.add("tags")
        $container_details.classList.add("container_details")


        const category = Array.from(JSON.parse(sessionStorage.CATEGORIES).categories);

        category.forEach((el, index) => {
            const $itemTag = document.createElement("label")

            $itemTag.classList.add("tag__item")
            $itemTag.setAttribute("for", `tag_${el}`)

            $itemTag.insertAdjacentHTML("beforeend", `
            	<input type="checkbox" class="tag__input" id="tag_${el}" name="${el}" value="${el}">
            	${el}
            	`)

            $tags.appendChild($itemTag)
        });


        $form.insertAdjacentHTML("beforeend", `
			<div class="container_drag_drop">
				<div id="zone_dg_dp" class="zone_dg_dp">
					
					<input type="file" accept="image/png, image/jpeg" title="Select an Image" name="images_file" id="images_file">
					<h4 class="h4"> <b>Drop</b> your image here </h4>
					<h4> or Click to <b>Browse</b> </h4>
				</div>
			</div>
            <div class="msg_upload"> ERROR</div>`);


        $uploadContainer.appendChild($form) // add the form witch zone drag and drop

        $container_details.appendChild($tags)

        $container_details.insertAdjacentHTML("afterbegin", `
            <img src="" id="img_loaded" class="img_loaded">`);

        $container_details.insertAdjacentHTML("beforeend", `
            
            <div class="container_nk">
            
            
            <div class="container_key">
                <label for="keywords">Keywords or tags</label>
                <textarea name="keywords" id="keywords" placeholder="separate for coma" minlength="2" required></textarea>
            </div>
            
            <div class="container_name">
                Image's Name
                <input type="text" name="name_img" id="name_img" placeholder="name Image" minlength="1" autocomplete="off">
            </div>
            </div> 
            <button type="submit">UPLOAD</button>
            `);

        $form.appendChild($container_details)

        $container.innerHTML = ""
        $container.appendChild($uploadContainer)
        const $msgUpload = $form.querySelector(".msg_upload")


        //drag & drop efect
        $form.querySelector("#images_file").addEventListener("dragover", (ev) => {
            $form.querySelector("#zone_dg_dp").classList.add("is-active")

        });

        $form.querySelector("#images_file").addEventListener("dragleave", (ev) => {
            $form.querySelector("#zone_dg_dp").classList.remove("is-active")
        });

        $form.querySelector("#images_file").addEventListener("drop", (ev) => {
            $form.querySelector("#zone_dg_dp").classList.remove("is-active")
        });

        // listener for validate if some file was select
        $form.addEventListener("change", ev => {
            if (ev.target.matches("#images_file")) {
                const file = ev.target.files[0],
                    url = URL.createObjectURL(file),
                    $topMsg = $msgUpload.getBoundingClientRect().y * -1

                if (file.type == "" || file.type.match(/image/) == false) {
                    $msgUpload.textContent = "the file Upload isn't Image"
                    $msgUpload.classList.add("is-active")

                    window.scrollTo({
                        behavior: "smooth",
                        top: $topMsg
                    });


                    setTimeout(() => {
                        $msgUpload.classList.remove("is-active")
                        $msgUpload.textContent = ""
                    }, 3000);

                } else {
                    let fileName = file.name.replace(/(.jpg)|(.png)|(.jpeg)/, "")
                    img_loaded.src = url
                    name_img.value = fileName.replace(/[\@\#\\\¡\º\!\|*?¿+:;+=+>+<\{}\[\]\.+``´´\/\'\"\+^\¨]/gi, "")
                    $container_details.setAttribute("class", "container_details active")


                    setTimeout(() => window.scrollTo({
                        behavior: "smooth",
                        top: img_loaded.getBoundingClientRect().y - 80
                    }), 500);
                }
            }
        });

        $container.addEventListener("click", ev => {
            if (ev.target.matches(".tag__item")) {
                const input = ev.target.children[0]

                if (input.checked == false)
                    ev.target.classList.add("active_checkbox")
                else
                    ev.target.classList.remove("active_checkbox")
            }
        });

        $form.addEventListener("submit", ev => {
            ev.preventDefault()

            if ([...ev.target.querySelectorAll(".tag__item input:checked")].length == 0) {
                $msgUpload.textContent = "Please add a categorie to Images"
                $msgUpload.classList.add("is-active")
                window.scrollTo({
                    behavior: "smooth",
                    top: $topMsg
                });

                setTimeout(() => {
                    $msgUpload.classList.remove("is-active")
                    $msgUpload.textContent = ""
                }, 3000);

                return false
            } else if (ev.target.images_file.files[0] == undefined) {
                return false
            } else if (ev.target.images_file.files[0].size > 3000000) {
                $msgUpload.textContent = "The Image exede the 3MB"
                $msgUpload.classList.add("is-active")

                window.scrollTo({
                    behavior: "smooth",
                    top: $topMsg
                });

                setTimeout(() => {
                    $msgUpload.classList.remove("is-active")
                    $msgUpload.textContent = ""
                }, 3000);

                return false
            }

            admin.uploadImage(ev.target, "create")
                .then(r => {
                    if (r) {
                        ev.target.reset()
                        $container_details.setAttribute("class", "container_details")
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0
                        });
                        Msg.showMsg("Image Saved Successfully", "success")

                        ev.target.querySelectorAll(".tag__item").forEach(el => {
                            el.classList.remove("active_checkbox")

                        });
                        return true
                    } else if (r == false) {
                        ev.target.reset()
                        $container_details.setAttribute("class", "container_details")
                        Msg.showMsg("Error", "error")
                        return false
                    }
                });
        });
    },

    async logout($container) {
        $container.innerHTML = ""
        localStorage.clear()
        sessionStorage.clear()
        location.href = "../login.html"
        if (opener !== null)
            opener.location.reload()
    },

    async saveImage(dataImage, $container) {
        //code for edit & save image
        try {
            //declaration of ELEMENTS
            const $form = document.createElement("form"),
                $tags = document.createElement("div")

            $form.setAttribute("id", "save_image")
            $tags.classList.add("tags")

            const category = Array.from(JSON.parse(sessionStorage.CATEGORIES).categories);

            category.forEach((el, index) => {
                const $itemTag = document.createElement("label")

                if (dataImage.categories.includes(el)) {
                    $itemTag.classList.add("tag__item", "active_checkbox")

                    $itemTag.insertAdjacentHTML("beforeend", `
	            	<input type="checkbox" class="tag__input" id="tag_${el}" name="${el}" value="${el}" checked="true">
	            	${el}
	            	`)
                } else {
                    $itemTag.classList.add("tag__item")

                    $itemTag.insertAdjacentHTML("beforeend", `
	            	<input type="checkbox" class="tag__input" id="tag_${el}" name="${el}" value="${el}">
	            	${el}
	            	`)
                }

                $itemTag.setAttribute("for", `tag_${el}`)

                $tags.appendChild($itemTag)
            });

            $form.insertAdjacentHTML("beforeend", `
				<div class="box-selection image">
					<img src="${dataImage.src}" id="img_loaded" class="img_loaded" alt="${dataImage.name}">	
					<input type="file" accept="image/png, image/jpeg" name="images_file" title="Select an Image" id="images_file" value="null" placeholder="Change">
				</div>
	        	`);

            $form.appendChild($tags)

            const $tpl = `
				<div class="name_keys">
					<div class="container_name">
			            Image's Name
			            <input type="text" name="name_img" id="name_img" placeholder="name Image" value="${dataImage.name}" minlength="1" autocomplete="off">
			        </div>

			        <div class="container_key">
		                <label for="keywords">Keywords or tags</label>
		                <textarea name="keywords" id="keywords" placeholder="separate for coma" minlength="2" required>${dataImage.keywords}</textarea>
			        </div>

				</div>

	            <button type="submit" class="update">
	            	<span class="fa fa-check"></span>Update
	            </button>

				<button type="button" class="cancel">
					<span class="fa fa-times"></span>Cancel
				</button>
			`;

            $form.insertAdjacentHTML("beforeend", $tpl);

            $container.innerHTML = ""
            $container.appendChild($form)
            setTimeout(() => $container.classList.add("active"), 100)

            // listener for validate if some file was select
            $form.addEventListener("change", ev => {
                if (ev.target.matches("#images_file")) {
                    const file = ev.target.files[0],
                        url = URL.createObjectURL(file);

                    if (file.type == "" || file.type.match(/image/) == false) {
                        Msg.showMsg("the file Upload isn't Image", "alert");
                        ev.target.reset()
                    } else {
                        let fileName = file.name.replace(/(.jpg)|(.png)|(.jpeg)/, "")
                        img_loaded.src = url
                        name_img.value = fileName.replace(/[\@\#\\\¡\º\!\|*?¿+:;+=+>+<\{}\[\]\.+``´´\/\'\"\+^\¨]/gi, "")
                        $container_details.setAttribute("class", "container_details active")
                    }
                }
            });

            $container.addEventListener("click", ev => {

                if (ev.target.matches(".tag__item")) {
                    const input = ev.target.children[0]

                    if (input.checked == false)
                        ev.target.classList.add("active_checkbox")
                    else
                        ev.target.classList.remove("active_checkbox")
                } else if (ev.target.matches(".cancel") || ev.target.matches(".cancel .fa")) {
                    $container.classList.remove("active")
                    setTimeout(() => $container.innerHTML = "", 1000)
                }

            });

            $form.addEventListener("submit", ev => {
                ev.preventDefault()

                if ([...ev.target.querySelectorAll(".tag__item input:checked")].length == 0) {
                    Msg.showMsg("Please add a category to Images", "alert")
                    return false
                } else if (images_file.files[0] != undefined) {
                    if (ev.target.images_file.files[0].size > 3000000) {
                        Msg.showMsg("The Image exede the 3MB", "alert", "alert")
                        return false
                    }
                }


                admin.uploadImage(ev.target, "update", dataImage.id)
                    .then(r => {
                        if (r) {
                            $container.classList.remove("active")


                            Msg.showMsg("Image Saved Successfully", "success", () => {
                                ev.target.reset()
                                $container.innerHTML = ""
                                this.images(document.getElementById("content"))
                            });
                            return true
                        } else if (r == false) {
                            ev.target.reset()
                            Msg.showMsg("Error", "error")
                            return false
                        }
                    });

                $container.classList.remove("active")
                setTimeout(() => $container.innerHTML = "", 1000)

            });

        } catch (e) {
            console.log(e);
            return false;
        }
    },

    async delete(node, imgObj, $container) {
        const $containerConfirm = document.createElement("div"),
            $containerMsg = document.createElement("div")

        $containerMsg.insertAdjacentHTML("beforeend", `
    		<p class="mark-delete">
    			<span class="fa fa-trash-alt"></span>
    			Are You Sure ?
            </p>
            
    		<button class="cancel-delete">
    			<span class="fa fa-times"></span>
    			Cancel
    		</button>

    		<button class="confirm-delete">
    			<span class="fa fa-trash-alt"></span>
    			Delete
    		</button>

    		`);


        $containerMsg.classList.add("msg_delete")
        $containerConfirm.appendChild($containerMsg)

        $container.appendChild($containerConfirm)

        $containerConfirm.classList.add("modal_delete_img")
        setTimeout(() => $containerConfirm.classList.add("is-active"), 500);

        $containerConfirm.addEventListener("click", ev => {

            if (ev.target.matches(".cancel-delete") || ev.target.matches(".cancel-delete .fa")) {

                $containerConfirm.classList.remove("is-active")

                setTimeout(() => {
                    $containerConfirm.innerHTML = ""
                    $container.removeChild($containerConfirm)
                }, 1000);

            } else if (ev.target.matches(".confirm-delete") || ev.target.matches(".confirm-delete .fa")) {

                // $containerConfirm.classList.add("not-active")

                admin.deleteIMG(imgObj.id)
                    .then(res => {

                        if (res == true) {
                            $containerMsg.innerHTML = `
				    		<p class="mark-delete">
				    			<span class="enf-mod fa fa-trash-alt"></span>
				    			Delete Successfully
				    		</p>
			    		    `;
                        } else {
                            $containerMsg.innerHTML = `
				    		<p class="mark-delete">
                                <span class="enf-mod fa fa-times"></span>
                                Error
				    		</p>
			    		    `;
                        }

                        setTimeout(() => $containerConfirm.classList.remove("is-active"), 3000)

                        setTimeout(() => {
                            $containerConfirm.innerHTML = ""
                            $container.removeChild($containerConfirm)
                        }, 4000);

                        node.parentNode.removeChild(node)
                    });
            };
        });


    },

    notFound($container) {
        $container.innerHTML = ""
        $container.insertAdjacentHTML("beforeend", `
        <div class="not_found_container">
            <h3 class="nf_404">404</h3>
            <p class="nf">NOT FOUND</p>
        </div>
        `)
    },

    async profile($container) {

        const tplProfile = `
        <div class="profile">
            <form id="form-profile">

                <div class="profile__avatar">
                    <div class="profile__icon" style="background-image: url(${userData.ico != null ? userData.ico : '../../../static/img/robot.svg'});">
                    </div>
                    <input value="null"  type="file" accept="image/png, image/jpeg" title="You have not selected any Image" name="user_image_ico" id="user_image_ico">
                </div>
                    
                <div class="data_user">
                    <label for="firstName">FIRST NAME</label>
                    <input type="text" name="firstName" class="notification" id="firstName" autocomplete="off" placeholder="Enter Your First Name" pattern="[a-zA-Z][^\s]{2,10}" required="required" value="${userData.first_name}">
                

                    <label for="lastName">LAST NAME</label>
                    <input type="text" name="lastName" class="notification" id="lastName" autocomplete="off" placeholder="Enter Your Last Name" pattern="[a-zA-Z][^\s]{2,15}" required="required" value="${userData.last_name}">

                    <label for="username">USERNAME <sub>(non-editable)</sub></label>
                    <input disabled type="text" name="username" id="username" autocomplete="off" placeholder="Username" pattern="[a-zA-Z0-9_][^\s]{5,15}" minlength="4" required="required" value="${userData.username}">
                </div>

                <div class="changePassword">
                    <h3>Change Your Password</h3>
                     
                    <label for="oldPassword">CURRENT PASSWORD <sub>(min. 8 char)</sub></label>
                    <input type="password" name="oldPassword" id="oldPassword" autocomplete="off" placeholder="********"  minlength="8">

                    <label for="password">NEW PASSWORD</label>
                    <input type="password" name="password" id="password" autocomplete="off" placeholder="********" minlength="8">
                    
                    <label for="passwordConfirm">CONFIRM NEW PASSWORD</label>
                    <input type="password" name="passwordConfirm" id="passwordConfirm" autocomplete="off" placeholder="********" minlength="8">

                </div>

                <button class="btn" type="submit">SAVE PROFILE</button>
            </form>
        </div>
        `;

        $container.innerHTML = ``;
        $container.insertAdjacentHTML("beforeend", tplProfile)
        const $form = $container.querySelector("#form-profile")

        $form.addEventListener("change", ev => {
            if (ev.target.matches("#user_image_ico")) {
                const file = ev.target.files[0],
                    url = URL.createObjectURL(file);

                if (file.type == "" || file.type.match(/image/) == false) {
                    Msg.showMsg("the file Upload isn't Image", "alert");
                    ev.target.reset()
                } else {
                    const $img_loaded_icon = ev.target.parentNode.querySelector(".profile__icon")
                    $img_loaded_icon.style.backgroundImage = `url(${url})`
                }
            } else if (ev.target.matches("input[type='text']")) {
                ev.target.classList.add("notification")
            }
        });



        $form.addEventListener("keyup", ev => {
            if (ev.target.matches("[type='password']")) {
                const val1 = password.value
                const val2 = passwordConfirm.value

                if (val1 != val2) {
                    password.classList.add("Error")
                    passwordConfirm.classList.add("Error")
                } else if (val1 == val2) {
                    password.classList.remove("Error")
                    password.classList.add("notification")
                    passwordConfirm.classList.remove("Error")
                    passwordConfirm.classList.add("notification")
                }
            }
        });


        $form.addEventListener("submit", ev => {
            ev.preventDefault()

            if (ev.target.user_image_ico.files[0] != undefined) {
                if (ev.target.user_image_ico.files[0].size > 2000000) {
                    Msg.showMsg("The Image exede the 2MB", "alert", "alert")
                    return false
                }
            } else if (ev.target.firstName.length < 2) {
                Msg.showMsg("Please Complete Your Data", "alert")
            } else if (ev.target.lastName.length < 2) {
                Msg.showMsg("Please Complete Your Data", "alert")
            }

            const $fileIcoUser = ev.target.user_image_ico.files[0] === undefined
                ? 0 : ev.target.user_image_ico.files[0]


            admin.updateUser(ev.target, $fileIcoUser)
                .then(res => {
                    if (res === true) {
                        Msg.showMsg("Profile Saved Successfully", "success", () => {
                            location.reload()
                        });

                    } else
                        Msg.showMsg("Error in Saved", "error")
                });

            /**
             * Codigo para enviar al admin.updateUser
             */

        });
    },

}

export default controllers;