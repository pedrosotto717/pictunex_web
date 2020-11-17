const crypter = (()=>{

	//sha256
	function sha256(str) {
      return CryptoJS.SHA256(str).toString();
    }

	//base64 encode
	function base64Enc(str) {
	    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
	        function toSolidBytes(match, p1) {
	            return String.fromCharCode('0x' + p1);
	    }));
	}

  //base64 decode
  function base64Dec(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

	return {
		base64Enc,
    base64Dec,
		sha256
	}

})();
