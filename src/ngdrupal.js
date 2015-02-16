(function() {

  var module = angular.module('ngdrupal', ['restangular'])
    // Set the Base url.
    .config(function(RestangularProvider) {
      // Base Url.
      RestangularProvider.setBaseUrl('http://MySiteSuperPoweredByDrupal/');
      RestangularProvider.setDefaultHttpFields({withCredentials: true});
    })

    // Remove this Service if you want to use your own session from your app.
    .service('DrupalSession', function () {
      // TODO TBD session fields.
      this.create = function (userId, userName, userLangcode) {
        this.userId = userId;
        this.userName = userName;
        this.userLangcode = userLangcode;
      };
      this.destroy = function () {
        this.userId = null;
        this.userName = null;
        this.userLangcode = null;
      };
      return this;
    })

    // AUTH SERVICE.
    // Apply https://www.drupal.org/node/2403307
    // and https://www.drupal.org/node/2419825
    .factory('AuthService', function(Restangular, DrupalSession) {
      return {
        login:function(user) {
          return Restangular.one('user_login').customPOST(
            JSON.stringify({"op": "login","credentials": {"name":user.name,"pass":user.pass}}),
            undefined, // put your path here
            undefined, // params here, e.g. {format: "json"}
            {ContentType: 'application/json', Accept: 'application/json'}
            // Remove if you want to use your own session from your app.
          ).then(function(result) {
              DrupalSession.create(result.uid[0].value, result.name[0].value, result.langcode[0].value);
            });
        },

        logout:function() {
          return this.getToken()
            .then(function(token) {

              // Remove if you want to use your own session from your app.
              DrupalSession.destroy();

              return Restangular.one('user_login').customPOST(
                JSON.stringify({"op": "logout"}),
                undefined, // put your path here
                undefined, // params here, e.g. {format: "json"}
                {ContentType: 'application/json', Accept: 'application/json', 'X-CSRF-Token': token}
              );
            }
          );
        },

        isAuthenticated:function() {
          // Use your own session here if you are not using the DrupalSession Service.
          return !!DrupalSession.userId;
        },

        getToken:function() {
          return Restangular.one('rest/session/token').get();
        }
      }
    })

    // REGISTER SERVICE. Apply https://www.drupal.org/node/2291055
    .factory('RegisterService', function(Restangular) {
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
    });

})();