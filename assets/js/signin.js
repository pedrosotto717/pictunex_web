
import slidePX from "./modules/slide-px.js"


const SignIn = {

  async register(el) {
    const formData = new FormData(el)

    const newUser = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userName: formData.get("username"),
      passWord: await crypter.sha256(formData.get("password"))
    }

    const json_enc = crypter.base64Enc(JSON.stringify(newUser)),
      final = new FormData()

    final.append("user", json_enc)

    const headers = new Headers()
    headers.append("CLIENT-ID", config.getCLIENT_ID())

    const res = await fetch(config.getURL_API() + "/auth/register", {
      method: "POST",
      body: final,
      headers
    });

    if (res.status != 200)
      return false;

    if (res.status === 201) {
      const resParse = await res.json()
      if (resParse.code == 201)
        return true;
    }

    return false;
  }

}

addEventListener("load", ev => {

  const slide = new slidePX({
    container: ".slide",
    items: ".slide__item",
    active: "is-active",
    activeOld: "is-active--prev",
    time: 6000,
    noMobile: true
  });

  setTimeout(() => {
    document.querySelector(".msg-welcome__content")
      .classList.add("is-active")
  }, 700);


  setTimeout(() => {
    // Added the observer and run the slider 
    slide.observer().run()
  }, 2500);

  document.querySelector(".form-sign-in").addEventListener("change", ev => {
    if (ev.target.matches("input[type='text']")) {
      ev.target.classList.add("notification")
    }
  });

  document.querySelector(".form-sign-in").addEventListener("keyup", ev => {
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

  document.querySelector("#form-sign-in .btn").addEventListener("click", () => {
    Array.from(document.querySelectorAll("input")).forEach(el => {
      el.classList.add("notification");
    });
  });

  document.querySelector("#form-sign-in").addEventListener("submit", ev => {
    ev.preventDefault()

    //Invoco para el registro
    const result = SignIn.register(ev.target);

    if (result === true) {

      ev.target.reset()
      const inputs = [...document.querySelectorAll("input[type='text']")]
      inputs.forEach(el => {
        el.classList.remove("notification")
        el.classList.remove("Error")
      });
      Msg.showMsg("Successful registered user", "success")

    } else {
      Msg.showMsg("ERROR", "error")
    }

  });


});

