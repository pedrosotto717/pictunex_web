config = (()=>{

	const URL_API = "http://localhost/server/api"
	const CLIENT_ID = "658b7218f1a95f8928153156d4983aa9a79a6ee867b0d2b6c4089e68e745e8974ee69aa43790d2b7b44e232c97b8eabb85dc8adef673847ab995d5b9d8573311"
	const maxImgForPag = 23
	const dashBoardRoutes = ["/home","/search","/images","/upload","/logout","/config","/profile"]


	return {
		getURL_API: ()=>{
			return URL_API;
		},

		getCLIENT_ID: ()=>{
			return CLIENT_ID;
		},

		getMaxForPag(){
			return maxImgForPag;
		},

		getRoutesDashBoard(){
			return dashBoardRoutes;
		}
	}

})();