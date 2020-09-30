/*
 * class InterfaceApiPX | Interface to connect whit API-PX, and do Request
 */

export default class InterfaceApiPX{

	constructor(url){
		this.URL = url
	}

	/*		Method to get all Images from API 		
		--return [[],[],[],...] 
	*/
	async getAll(){

		try {
			const response = await fetch(this.URL + "/images");

			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					const arrReponse = this.reduceArray(responseParse,30)
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
			const response = await fetch(this.URL + "/images/" + id);

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
	async search(keyWord){
		try {
			const response = await fetch(this.URL + "/images/search?q=" + keyWord);

			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					const arrReponse = this.reduceArray(responseParse,30)
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
	async getByCategory(category){
		try {
			const response = await fetch(this.URL + `/images/category/${category}`);

			if(response.status == 200){
				const responseParse = await response.json()
				
				return new Promise((res,rej)=>{
					const arrReponse = this.reduceArray(responseParse,30)
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