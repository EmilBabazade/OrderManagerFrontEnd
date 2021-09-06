angular.module('core.vaqon')
    .factory('vaqonService', function($http, $window, portNumber) {
        const baseURL = `https://localhost:${portNumber}/api/`;
        const auth = $window.localStorage.getItem("token")
        return {
            getVaqonNoId: function(success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}Vaqons?getBoth=true&&getWithoutOrderId=true`,
                    headers: {
                        'Authorization': `bearer ${auth}` 
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function failureCallback(res) {
                    failure(res.status)
                })
            },
            getVaqonMBnoOrderID: function(success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}Vaqons?getWithoutOrderId=true`,
                    headers: {
                        'Authorization': `bearer ${auth}` 
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function failureCallback(res) {
                    failure(res.status)
                })
            },
            getVaqonMBKnoOrderID: function(success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}Vaqons?getMilliBrokerdenKecmis=true&getWithoutOrderId=true`,
                    headers: {
                        'Authorization': `bearer ${auth}` 
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function failureCallback(res) {
                    failure(res.status)
                })
            },
            deleteVaqon: function(vaqonId, success, failure) {
                $http({
                    method: 'DELETE',
                    url: `${baseURL}Vaqons`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}` 
                    },
                    data: {
                        'VaqonId': vaqonId
                    }
                }).then(function successCallback(res) {
                    success()
                }, function failureCallback(res) {
                    failure(res.status)
                })
            },
            createVaqonMB: function(
                docType, file, fileName, success, failure
            ) {
                // save file to server
                // IFORM file on the endpoint in the server side
                // is just null
                // the data being sent is correct, the signature and etc all stuff as i have
                // checked is also correct. Not sure what is wrong here
                // $http({
                //     method: 'POST',
                //     url: `${baseURL}QaimeFile`,
                //     headers: {
                //         'Authorization': `bearer ${auth}`,
                //         'Content-Type': undefined
                //     },
                //     data: file
                // }).then(function successCallback(res) {

                // }, function failureCallback(res) {
                //     console.log(`error when saving file, status ${res.status}`)
                // })
                // insert vaqon
                $http({
                    method: 'POST',
                    url: `${baseURL}Vaqons`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}` 
                    },
                    data: {
                        'vaqonMB': {
                            'Dokument': fileName,
                            'DokumentNovu': docType
                        }
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function failureCallback(res){
                    failure(res.status)
                })
            },
            createVaqonMBK: function(
                type, success, failure
            ) {
                $http({
                    method: 'POST',
                    url: `${baseURL}Vaqons`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}` 
                    },
                    data: {
                        'vaqonMBK': {
                            'Nov': type
                        }
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function failureCallback(res){
                    failure(res.status)
                })
            }
        }
    })