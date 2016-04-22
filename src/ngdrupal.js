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
        this.csrfToken = user.csrfToken;
      };
      this.destroy = function () {
        this.user = null;
        this.sessionName = null;
        this.sessId = null;
        this.extra = null;
        this.csrfToken = null;
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
          DrupalSession.destroy();
          return Restangular.one('user_login').customPOST(
            JSON.stringify({"op": "logout"}),
            undefined, // Path
            undefined, // Params {format: "json"}
            {ContentType: 'application/json', Accept: 'application/json', 'X-CSRF-Token': DrupalSession.csrfToken}
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

    // ENTITY SERVICE for CRUD operations.
    .factory('EntityService', function(myConfig, Restangular, AuthService, $q, DrupalSession) {
      return {
        createMultiple: function(entityType, bundle, values) {
          var promises = [];
          angular.forEach(values, function(data) {
            // Building the json.
            var request = {};
            request = {"_links": {"type": {"href": myConfig.url + '/rest/type/' + entityType + '/' + bundle}}};
            // Adds values per field.
            angular.forEach(data, function(value, key) {
              if (value !== null && typeof value !== "object") {
                request[key] = [{"value": value}];
              }
              else if(typeof value === "object") {
                request[key] = value;
              }
            });
            var promise = Restangular.one('entity/' + entityType).customPOST(
              JSON.stringify(request),
              undefined, // Path
              undefined, // Params {format: "json"}
              {"Content-Type": 'application/hal+json', Accept: 'application/hal+json', 'X-CSRF-Token': DrupalSession.csrfToken}
            );
            promises.push(promise);
          });
          return $q.all(promises);
        },

        create: function(entityType, bundle, values) {
          var request = {};
          request = {"_links": {"type": {"href": myConfig.url + '/rest/type/' + entityType + '/' + bundle}}};

          // Add values per field to the json.
          angular.forEach(values, function(value, key) {
            if (value !== null && typeof value !== "object") {
              request[key] = [{"value": value}];
            }
            else if(typeof value === "object") {
              request[key] = value;
            }
          });

          return Restangular.one('entity/' + entityType).customPOST(
            JSON.stringify(request),
            undefined, // Path
            undefined, // Params {format: "json"}
            {"Content-Type": 'application/hal+json', Accept: 'application/hal+json', 'X-CSRF-Token': DrupalSession.csrfToken}
          );
        },

        delete: function(entityType, id) {
          return Restangular.one( entityType + '/' + id).customDELETE(
            undefined, // Path
            undefined, // Params {format: "json"}
            {"Content-Type": 'application/hal+json', Accept: 'application/hal+json', 'X-CSRF-Token': DrupalSession.csrfToken}
          );
        }
      };
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