angular.module('core.user')
    .factory('loginService', function($http, $window, portNumber) {
        const baseURL = `https://localhost:${portNumber}/api/Accounts/`;
        const tokenKey = "token";
        const nameKey = "name";
        const lastnameKey = "lastname";
        return {
            login: function(email, password, success, failure) {
                $http({
                    method: 'POST',
                    url: `${baseURL}Login`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;'
                    } ,
                    data: {
                        Email: email,
                        Password: password
                    }
                }).then(function successCallback(res) {
                    $window.localStorage.setItem(tokenKey, res.data.token)
                    $window.localStorage.setItem(nameKey, res.data.name)
                    $window.localStorage.setItem(lastnameKey, res.data.lastname)
                    success()
                }, function errorCallback(res) {
                    if(res.status == 401) {
                        failure()
                    }
                })
            },
            logout: function(then) {
                $window.localStorage.removeItem(tokenKey)
                $window.localStorage.removeItem(nameKey)
                $window.localStorage.removeItem(lastnameKey)
                then()
            }
        }
    })