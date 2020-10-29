const Msg = {
  containerModalRedirect: ".modal_container",
  
  showMsg(msg,callback){
    const $rModal = document.querySelector(this.containerModalRedirect)
    $rModal.querySelector(".msg").textContent = msg
    $rModal.classList.add("is-active")

    setTimeout(()=>{
      $rModal.classList.remove("is-active")
      if(typeof callback === "function")
        callback()
    },3000);
  }
}
