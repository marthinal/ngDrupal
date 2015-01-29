
(function() {

var module = angular.module('ngdrupal', ['restangular'])

  // Set the Base url.
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://example.com/');
  })

  // Login Service.
  .factory('loginService', function($http, Restangular) {
    return {
      login:function(user) {
        data = '&name=' + user.name + '&pass=' + user.pass + '&form_id=user_login_form';
        var login = Restangular.one('user/login').customPOST(
          data,
          undefined, // put your path here
          undefined, // params here, e.g. {format: "json"}
          {'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"}
        );
      }
    }
  })

})();
