
(function() {

var module = angular.module('ngdrupal', ['restangular'])

  // Set the Base url.
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://example.com/');
  })

  // Login Service.
  .factory('loginService', function($http, Restangular) {
    return {

    }
  })

})();
