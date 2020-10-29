const crypter = (()=>{

	//sha256
	function sha256(str) {
      // We transform the string into an arraybuffer.
      var buffer = new TextEncoder("utf-8").encode(str);
      return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
        return hex(hash);
      });
    }

	//hex complement of sha256
    function hex(buffer) {
      var hexCodes = [];
      var view = new DataView(buffer);
      for (var i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i),
        	stringValue = value.toString(16),
        	padding = '00000000',
        	paddedValue = (padding + stringValue).slice(-padding.length)

        hexCodes.push(paddedValue);
      }

      // Join all the hex strings into one
      return hexCodes.join("");
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
