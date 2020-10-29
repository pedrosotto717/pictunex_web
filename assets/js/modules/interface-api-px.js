/*
 * class InterfaceApiPX | Interface to connect whit API-PX, and do Request
 */

export default class InterfaceApiPX{

	constructor(url){
		this.URL = url
		this.maxForPag = config.getMaxForPag()
	}

	/*		Method to get all Images from API 		
		--return [[],[],[],...] 
	*/
	async getAll(userId = null){

		try {

			let response = null;

			if(userId===null)
				response = await fetch(this.URL + "/images");
			else if(userId != null && userId != undefined && userId.length>0)
				response = await fetch(this.URL + `/images&user_id=${userId}`);
			else return null

			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					const arrReponse = this.reduceArray(responseParse,this.maxForPag)
					console.log(arrReponse)
					res(arrReponse)
				})
			}else
				return null;

		}catch(e) {
			console.log(e);
		}
	}

	/*		Method to get by Images' id from API 		
		--return Object 
	*/
	async getById(id){
		try {
			const response = await fetch(this.URL + `/images/${id}`);

			if(response.status==200)
				return await response.json()
			else
				return null;

		}catch(e) {
			console.log(e);
		}
	}

	/*		Method to get Categories		
		--return Array 
	*/
	async getCategories(){
		try {
			const response = await fetch(this.URL + "/images/category");

		if(response.status==200){
			const responseParse = await response.json()
			return new Promise((res,rej)=>{
				res(responseParse)
			})
		}else
			return null;

		}catch(e) {
			console.log(e);
		}
	}


	/*		Method to search for keyWord		
		--return [[],[],[],...] 
	*/
	async search(keyWord,userId = null){
		try {

			let response = null;

			if(userId===null)
				response = await fetch(this.URL + `/images/search?q=${keyWord}`);
			else if(userId != null && userId != undefined && userId.length>0)
				response = await fetch(this.URL + `/images/search?q=${keyWord}&user_id=${userId}`);
			else return null;


			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					const arrReponse = this.reduceArray(responseParse,this.maxForPag)
					res(arrReponse)
				})
			}else if(response.status == 404)
				return null
			else
				return false;

		}catch(e) {
			console.log(e);
		}
	}


	/*		Method to search for categories		
		--return [[],[],[],...] 
	*/
	async getByCategory(category,userId = null){
		try {
			console.log(null)
			let response = null;

			if(userId === null)
				response = await fetch(this.URL + `/images/category/${category}`);
			else if(userId != null && userId != undefined && userId.length>0)
				response = await fetch(this.URL + `/images/category/${category}&user_id=${userId}`);
			else return null;

			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					console.table(responseParse)
					const arrReponse = this.reduceArray(responseParse,this.maxForPag)
					res(arrReponse)
				})
			}else
				return null;

		}catch(e) {
			console.log(e);
		}
	}

	/**
	 * Methods Auxs
	 */

	reduceArray(arrObj,ln){
		let arrReponse = []
		for(let p = 0, p2 = 1, l = Math.ceil(arrObj.length / ln); p < l; p++, p2++){
			
			//0*30 == 0, 1*30 == 30
			//1*30 == 30, 2*30 == 60
			//2*30 == 60, 3*30 == 90
			let arr = [...arrObj.slice((p*ln), (p2*ln))]
			arrReponse.push(arr)
		}
		return arrReponse
	}
}