describe('ngDrupal Unit Tests:', function() {

  var httpBackend, Restangular, q, scope;

  beforeEach(module('ngdrupal'));
  // then we use the $injector to obtain the instances of the services we would like to mock/use
  // but not of the service that we want to test
  beforeEach(inject(function(_Restangular_, _$httpBackend_, $q, $rootScope) {
    httpBackend = _$httpBackend_;
    Restangular = _Restangular_;
    q = $q;
    scope = $rootScope.$new();
  }));

  it('loginService Unit Test', inject(function(loginService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // a parameter with which the http service we expect to be called
    var user = {name:"marthinal", pass:"shhhhThisIsMySecret"};
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/user_login', {"op":"login","credentials":{"name": "marthinal", "pass": "shhhhThisIsMySecret"}})
      .respond();
    // now call our service
    loginService.login(user);
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('user_login');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

});

