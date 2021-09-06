angular.module('core.order')
    .factory('orderService', function($http, $window, portNumber) {
        const baseURL = `https://localhost:${portNumber}/api/Orders/`;
        const auth = $window.localStorage.getItem("token")
        return {
            getOrders: function(success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}GetOrders`,
                    headers: {
                        'Authorization': `bearer ${auth}`
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            getOrdersStartDate: function(startDate, success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}GetOrders?startDate=${startDate}`,
                    headers: {
                        'Authorization': `bearer ${auth}`
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            getOrdersStartDateEndDate: function(startDate, endDate, success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}GetOrders?startDate=${startDate}&endDate=${endDate}`,
                    headers: {
                        'Authorization': `bearer ${auth}`
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            createOrder: function(xidmet, vahid, miqdar,
                qiymet, tarix, vaqonId, success, failure) {
                $http({
                    method: 'POST',
                    url: `${baseURL}CreateOrder`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}`
                    } ,
                    data: {
                        'Xidmet': xidmet,
                        'Vahid': vahid,
                        'Miqdar': miqdar,
                        'Qiymet': qiymet,
                        'Tarix': tarix,
                        'VaqonId': new Number(vaqonId)
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            deleteOrder: function(OrderId, success, failure) {
                $http({
                    method: 'DELETE',
                    url: `${baseURL}DeleteOrder`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}`
                    } ,
                    data: {
                        'OrderId': OrderId
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            payOrder: function(OrderId, EndDate, success, failure) {
                $http({
                    method: 'POST',
                    url: `${baseURL}PayOrder`,
                    headers: {
                        'Content-Type':'application/json; charset=utf-8;',
                        'Authorization': `bearer ${auth}`
                    } ,
                    data: {
                        Id: OrderId,
                        EndDate: EndDate
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            },
            getTotalBorc: function(success, failure) {
                $http({
                    method: 'GET',
                    url: `${baseURL}GetTotalBorc`,
                    headers: {
                        'Authorization': `bearer ${auth}`
                    }
                }).then(function successCallback(res) {
                    success(res.data)
                }, function errorCallback(res) {
                    failure(res.status)
                })
            }
        }
    })