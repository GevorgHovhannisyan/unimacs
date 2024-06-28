import router from '../router'

const pagePermissions = function (permissions) {
    let checkFalse = function (obj) {
        for (var i in obj) {
            if (obj[i] == true) return false;
        }
        return true;
    };
    let checkFalses = function (obj) {
        for (var i in obj) {
            for (var j in obj[i]) {
                if (obj[i][j] == true) return false;
            }
        }
        return true;
    };
    
    if (checkFalse(permissions)) {
        let routes = router.options.routes[0].children;
        let route = routes.filter((r) => r.custom);
        let perms = JSON.parse(localStorage.permissions);
        for (let i = 1; i < route.length; i++) {
            if (!checkFalses(perms[route[i].name])) {
                return route[i].path
            }
        }
    } else {
        return true
    }
}

export { pagePermissions };