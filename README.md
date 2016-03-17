# ngDrupal

Angular module for Drupal 8 Rest Services using cookie sessions. Actually this
 is a WIP.

 This module uses Restangular(https://github.com/mgonto/restangular#restangular)
  module as a dependency.


List of available services:

AUTHSERVICE:

 ```
  // Login for an ionic(http://ionicframework.com/) app
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

  // Logout for an ionic(http://ionicframework.com/) app.
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
