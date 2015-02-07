(function() {

  var module = angular.module('ngdrupal', ['restangular'])
    // Set the Base url.
    .config(function(RestangularProvider) {
      // Base Url.
      RestangularProvider.setBaseUrl('http://MySiteSuperPoweredByDrupal/');
      RestangularProvider.setDefaultHttpFields({withCredentials: true});
    })

    // Login Service.
    // Apply https://www.drupal.org/node/2403307
    // and https://www.drupal.org/node/2419825
    .factory('loginService', function($http, Restangular) {
      return {
        login:function(user) {
          return Restangular.one('user_login').customPOST(
            JSON.stringify({"op": "login","credentials": {"name":user.name,"pass":user.pass}}),
            undefined, // put your path here
            undefined, // params here, e.g. {format: "json"}
            {ContentType: 'application/json', Accept: 'application/json'}
          );
        }
      }
    })

})();

