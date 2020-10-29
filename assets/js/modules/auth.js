const auth = (() => {

  /**
    * @param (dataUser) true for get UserData
  **/

	async function verifyToken(dataUser){ 
		try {
			const ACCESS_TOKEN = getTokenStorage()

      console.log("ACCESS_TOKEN")

			if(ACCESS_TOKEN===false){
				localStorage.clear()
				throw new Error("TOKEN INVALID NOT_EXIST")
				return false
			}

      console.table(ACCESS_TOKEN)

			const JWT = "Bearer " + ACCESS_TOKEN;

			const headers = new Headers()
		    headers.append("AUTHORIZATION-TOKEN",JWT)

      let response = null;

  		if(dataUser==true){ //For get Data of Users

  			let usr = new FormData()
  			usr.append("user",true)
        //flag__
        response = await fetch(config.getURL_API() + "/auth/verify", {
		      method: "POST",
		      headers,
		      body: usr
		    });

  		}else{
		    response = await fetch(config.getURL_API() + "/auth/verify", {
		      method: "POST",
		      headers
		    });
  		}        

  	    if(response.status === 200) { // all Ok

  	      const responseParse = await response.json()
          console.log(responseParse)

          if(responseParse.code === 200)
            return {status: true, code: responseParse.code, response: responseParse}
          else{
            localStorage.clear()
            return {status: false, code: 0}
          }

  	    }else if (response.status === 401) {
          
          localStorage.clear()
          const responseParse = await response.json()
  		    return {status: false, code: responseParse.code}
  	  	}

  		} catch(e) {
  			console.log(e);
        		return {status: false, code: 0}
  		}
	}

	function getTokenStorage() {
		const TK = localStorage.getItem("ACCESS_TOKEN") || false;

		if(TK!=false && TK.length > 255)
			return TK;
		else
			return false;
	}

	return {
		verifyToken
	}

})();

// let tkw = 0;
// async function al () {
// 	console.log("INICIANDO")
// 	tkw = await auth.verifyToken() 
// 	console.log("FINAL TOKEN", tkw)
// 	console.log("FINALIZANDO")
// }