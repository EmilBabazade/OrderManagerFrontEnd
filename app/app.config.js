angular.
  module('orderManager').
  config(['$routeProvider',
    function config($routeProvider) {
      // if user is logged in redirect to orderList
      $routeProvider
        .when('/login', {
          template: '<login></login>'
        })
        .when('/order', {
          template: '<order></order>'
        })
        .otherwise('/login');
    }
  ]);