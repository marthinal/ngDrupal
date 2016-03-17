(function() {

  var module = angular.module('ngdrupal', ['restangular'])
    .config(function(RestangularProvider) {
      RestangularProvider.setDefaultHttpFields({withCredentials: true});
    })

    .service('DrupalSession', function () {
      this.create = function (user) {
        this.user = user.user;

        this.sessionName = user.sessionName;
        this.sessId = user.sessId;
        this.extra = user.extra;
      };
      this.destroy = function () {
        this.user = null;
        this.sessionName = null;
        this.sessId = null;
        this.extra = null;
      };
      return this;
    })

    // AUTH SERVICE.
    // @See https://www.drupal.org/node/2403307
    // and https://www.drupal.org/node/2419825
    .factory('AuthService', function(Restangular, DrupalSession) {
      return {
        login: function(user) {
          return Restangular.one('user_login').customPOST(
            JSON.stringify({"op": "login","credentials": {"name":user.name,"pass":user.pass}}),
            undefined, // Path
            undefined, // Params {format: "json"}
            {ContentType: 'application/json', Accept: 'application/json'}
          ).then(function(result) {
            DrupalSession.create(result);
          });
        },

        logout: function() {
          return this.getToken()
            .then(function(token) {
                DrupalSession.destroy();
                return Restangular.one('user_login').customPOST(
                  JSON.stringify({"op": "logout"}),
                  undefined, // Path
                  undefined, // Params {format: "json"}
                  {ContentType: 'application/json', Accept: 'application/json', 'X-CSRF-Token': token}
                );
              }
            );
        },

        isAuthenticated: function() {
          return DrupalSession.user && !!DrupalSession.user.uid[0].value;
        },

        getToken: function() {
          return Restangular.one('rest/session/token').get();
        }
      }
    })

    // REGISTER SERVICE. Apply https://www.drupal.org/node/2291055
    .factory('RegisterService', function(Restangular) {
      return {
        register: function(user) {
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