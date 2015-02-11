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
    .factory('loginService', function(Restangular) {
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

    // Logout Service.
    .factory('logoutService', function(Restangular, getTokenService) {
      return {
        logout:function(token) {
          return getTokenService.getToken()
            .then(function(token) {
              return Restangular.one('user_login').customPOST(
                JSON.stringify({"op": "logout"}),
                undefined, // put your path here
                undefined, // params here, e.g. {format: "json"}
                {ContentType: 'application/json', Accept: 'application/json', 'X-CSRF-Token': token}
              );
            }
          );
        }
      }
    })

    // Register Service. Depends on https://www.drupal.org/node/2291055 .
    .factory('registerService', function(Restangular) {
      return {
        register:function(user) {
          return Restangular.one('entity/user/register').customPOST(
            JSON.stringify({"name":[{"value": user.name}],"mail":[{"value": user.email}]}),
            undefined, // put your path here
            undefined, // params here, e.g. {format: "json"}
            {ContentType: 'application/json', Accept: 'application/json'}
          );
        }
      }
    })

    // Get token Service.
    .factory('getTokenService', function(Restangular) {
      return {
        getToken:function() {
          return Restangular.one('rest/session/token').get();
        }
      }
    })

})();
