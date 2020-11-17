
const login = {

  containerModalRedirect: ".modal_container",

  async auth(form) {

    const username = form.querySelector("#username"),
      password = form.querySelector("#password")

    const passwordC = await crypter.sha256(password.value),
      user = crypter.base64Enc(username.value + ":" + passwordC),
      headers = new Headers()

    headers.append("host", "localhost")
    headers.append("AUTHENTICATION", user)
    console.log(user)

    const res = await fetch(config.getURL_API() + "/auth/token", {
      method: "POST",
      headers
    });

    if (res.status === 200) {
      const resParse = await res.json()
      console.log(resParse);
      localStorage.setItem("ACCESS_TOKEN", resParse.access_token);
      return true;
    } else if (res.status === 500) {
      return 500;
    } else {
      return false;
    }
  },

  async isRedirect() {
    const access_token = await auth.verifyToken(false)

    if (access_token.code === 200) {
      Msg.showMsg("Already Session Active", "info")

      setTimeout(() => {
        location.href = "./dashboard"
        return true;
      }, 5000);

    } else if (access_token.code === 401) {
      localStorage.clear()
      return false;
    } else {
      localStorage.clear()
      return false;
    }
  }
}


addEventListener("load", () => {

  login.isRedirect()

  document.querySelector("#login-px").addEventListener("submit", async ev => {
    ev.preventDefault()

    const session = await login.isRedirect()
    console.table("SSESION FINAL____", session)

    if (session == false) {

      login.auth(ev.target)
        .then(res => {

          if(res===true)
            location.href = "./dashboard"
          else if(res == 500){
            Msg.showMsg("500 Internal Error","error", ()=>{
              ev.target.reset()
              username.focus()
            });
          }else
          Msg.showMsg("User Or Password Invalid","error", ()=>{
              ev.target.reset()
              username.focus()
            });

        });

    } else {
      window.location.reload()
    }

  });

  setInterval(() => {
    login.isRedirect()
  }, 15000);


  document.querySelector("#login-px").addEventListener("change", ev => {
    if (ev.target.matches("input")) {
      ev.target.classList.add("notification")
    }
  });

  setTimeout(() => {
    document.querySelector(".login").classList.add("active")
  }, 700)

});