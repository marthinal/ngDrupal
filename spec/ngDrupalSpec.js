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

  // LOGIN.
  it('Unit Test for loginService', inject(function(loginService) {
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

  // LOGOUT.
  it('Unit Test for logoutService', inject(function($rootScope, $q, logoutService, getTokenService) {
    deferred = $q.defer();
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // set up a spy on getTokenService
    spyOn(getTokenService, 'getToken').and.returnValue(deferred.promise);
    // Simulate resolving of promise
    deferred.resolve();
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/user_login', {"op":"logout"})
      .respond();
    // now call our service
    logoutService.logout();
    // Propagate promise resolution to 'then' functions.
    $rootScope.$digest();
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('user_login');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

  // REGISTER.
  it('Unit Test for registerService', inject(function(registerService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // a parameter with which the http service we expect to be called
    var user = {name:"marthinal", email:"marthinal@drupalisawesome.com"};
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/entity/user/register', {"name":[{"value": "marthinal"}],"mail":[{"value": "marthinal@drupalisawesome.com"}]})
      .respond();
    // now call our service
    registerService.register(user);
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('entity/user/register');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

  // GET TOKEN.
  it('Unit Test for getTokenService', inject(function(getTokenService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectGET('http://MySiteSuperPoweredByDrupal/rest/session/token')
      .respond();
    // now call our service
    getTokenService.getToken();
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('rest/session/token');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

});

