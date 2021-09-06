angular.module('login')
  .component('login', {
    templateUrl: 'login/login.html',
    controller: function LoginCotnrolerr($location, loginService) {
      let self = this
      this.loginUser = function() {
        self.invalidLogin = false
        loginService.login(this.email, this.password, 
          function() {
            // redirect to orders
            $location.path('/order')
          },
          function() {
            self.invalidLogin = true
          })
      }
    }
  })