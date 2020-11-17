const Msg = {
  containerModalRedirect: ".modal_container",
  
  showMsg(msg, typeMsg = "info",callback){ 
    const $rModal = document.querySelector(this.containerModalRedirect)
    $rModal.querySelector(".msg").textContent = msg

    console.log(typeMsg)
    console.log($rModal)

    const $icon = $rModal.querySelector(".ico__m")
    console.log($icon)
    if(typeMsg == "info"){
      $icon.setAttribute("class", "ico__m fa fa-exclamation")

    }else if(typeMsg == "success"){
      $icon.setAttribute("class", "ico__m fa fa-check")

    }else if(typeMsg == "alert"){
      $icon.setAttribute("class", "ico__m fa fa-exclamation-triangle")

    }else if(typeMsg == "error"){

      $icon.setAttribute("class", "ico__m fa fa-times")
    }else{

      $icon.setAttribute("class", "ico__m fa fa-info")
    }


    $rModal.setAttribute("class",`modal_container is-active ${typeMsg}`)

    setTimeout(()=>{
      $rModal.setAttribute("class",`modal_container`)
      console.log($rModal)

      if(typeof callback === "function")
        callback()
    },3000);
      console.log($rModal)
  }
}
