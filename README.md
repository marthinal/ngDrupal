# ngDrupal

Angular module for Drupal 8 Rest Services using cookie sessions. Actually this
 is a WIP.

 This module uses Restangular(https://github.com/mgonto/restangular#restangular)
  module as a dependency.


List of available services:

## AUTHSERVICE:

### Login (ionic app (http://ionicframework.com/))

 ```
  // user.name = 'marthinal'
  // user.pass = 'supersecretpass'
  $scope.login = function(user) {
    AuthService.login(user)
      // Go to "My account".
      .then(function(data) {
        $state.go('tab.account');
      })
      .catch(function() {
        $ionicPopup.alert({
          title: $translate.instant('login'),
          template: $translate.instant('unrecognized_username_password')
        });
    });
  };
 ```

### LogOut (ionic app (http://ionicframework.com/))
 ```
  $scope.logout = function() {
    AuthService.logout()
      // Go to "Login tab".
      .then(function() {
        $state.go('login');
      })
      .catch(function() {
        $ionicPopup.alert({
          title: 'Logout',
          template: 'Oops Cannot logout!'
        });
      });
    }

    // GetToken
    AuthService.getToken()
      .then(function(token) {
        // Operations.
      });

 ```

## ENTITY SERVICE.

### CRUD operations.
#####This resource uses hal+json as format by default. We can improve it/refactor later.

### Create Multiple Nodes.

  ```
    for (var i = 0; i < $scope.foo.length; i++) {
      var obj = $scope.foo[i];
      values[i] = {};
      values[i]["_embedded"] = {};
      values[i]["title"] = obj.name;
      // Attaching ER.
      values[i]["_embedded"][myConfig.url + "/rest/relation/node/bundle/myfield"] = [{"uuid":[{"value": obj.uuid}]}];
    }

    EntityService.createMultiple('node', 'myBundle', values)
      .then(
        function(result) {

        },
        function(error) {

        }
      );
  ```


### Create a user:

  ```
  var values = {
    name: "marthinal",
    mail: "marthinal@example.com"
  };

    EntityService.create('user', 'user', values)
      .then(function(entity) {

      })
      .catch(function() {

      });
  ```

###Upload a file:

  ```
 var pictureValues = {
   filename: "default.jpg",
   filemime: "image/jpg",
   data: imageData
  };

 EntityService.create('file', 'file', pictureValues)
   .then(function(entity) {

   })
   .catch(function() {

 });

  ```

### Create a taxonomy term:

  ```
   var values = {
     vid: 'tags',
     name: 'myTerm'
   };

   EntityService.create('taxonomy_term', 'tags', values)
     .then(function(entity) {

     })
     .catch(function() {

     });

 ```

### Delete.

```
// i.e. You can delete your user account
EntityService.delete('user', DrupalSession.user.uid[0].value);
```

