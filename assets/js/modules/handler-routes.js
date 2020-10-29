// import admin from "./admin.js";


const handlerRoutes = ( () => {
    const routes = config.getRoutesDashBoard()
    const controllers = {}
    const containerMain = document.getElementById("content")

    const handler = async function(route,toHome){

        if(routes.includes(route)){
            // console.log("hash",route)
            // console.info("admin::",admin)
            // console.log("__CTRL__",route,controllers,controllers[route])
            controllers[route](containerMain)
        }else if(route == "/" || route == "" || toHome === true){
            controllers["/home"](containerMain)
        }else if(toHome===false){
            //Not Found
            controllers["NOT_FOUND"]()
        }
    }

    const defineController = function(route, fnController){
        if(typeof fnController === "function")
            controllers[route] = fnController
        else return false
    }

    return {
        handler,
        defineController
    }

})();

export default handlerRoutes;