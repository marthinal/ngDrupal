describe('AuthService and RegisterService:', function() {

  var httpBackend, Restangular, q, scope;

  beforeEach(module('ngdrupal', function($provide) {
    // Mock DrupalSession Service.
    $provide.service('DrupalSession', function() {
      this.create = function() {};
      this.destroy = function() {};
    });
  }));
  // then we use the $injector to obtain the instances of the services we would like to mock/use
  // but not of the service that we want to test
  beforeEach(inject(function(_Restangular_, _$httpBackend_, $q, $rootScope) {
    httpBackend = _$httpBackend_;
    Restangular = _Restangular_;
    q = $q;
    scope = $rootScope.$new();
  }));

  // LOGIN.
  it('Should request for login as marthinal', inject(function($rootScope, $q, AuthService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // a parameter with which the http service we expect to be called
    var user = {name:"marthinal", pass:"shhhhThisIsMySecret"};
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/user_login', {"op":"login","credentials":{"name": "marthinal", "pass": "shhhhThisIsMySecret"}})
      .respond();
    // now call our service
    AuthService.login(user);
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('user_login');
    httpBackend.flush();
  }));

  // LOGOUT.
  it('Should request for logout', inject(function($rootScope, $q, AuthService) {
    deferred = $q.defer();
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // set up a spy on getTokenService
    spyOn(AuthService, 'getToken').and.returnValue(deferred.promise);
    // Simulate resolving of promise
    deferred.resolve();
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/user_login', {"op":"logout"})
      .respond();
    // now call our service
    AuthService.logout();
    // Propagate promise resolution to 'then' functions.
    $rootScope.$digest();
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('user_login');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

  // REGISTER.
  it('Should request for a user registration', inject(function(RegisterService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // a parameter with which the http service we expect to be called
    var user = {name:"marthinal", email:"marthinal@drupalisawesome.com"};
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectPOST('http://MySiteSuperPoweredByDrupal/entity/user/register', {"name":[{"value": "marthinal"}],"mail":[{"value": "marthinal@drupalisawesome.com"}]})
      .respond();
    // now call our service
    RegisterService.register(user);
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('entity/user/register');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

  // GET TOKEN.
  it('Should request for the token', inject(function(AuthService) {
    // set up a spy on Restangular, so we test with what parameters it was called, also allow the call to continue
    spyOn(Restangular, 'one').and.callThrough();
    // httpBackend would append a "/" in front of a restangular call
    httpBackend.expectGET('http://MySiteSuperPoweredByDrupal/rest/session/token')
      .respond();
    // now call our service
    AuthService.getToken();
    // handle restangular expectations
    expect(Restangular.one).toHaveBeenCalledWith('rest/session/token');
    // flush the backend to unproxy the restangular promise
    httpBackend.flush();
  }));

});



describe('DrupalSession:', function() {

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

  // Create, DrupalSession service.
  it('Should create a session', inject(function(DrupalSession) {
    var user = {user:"user", sessionName:"sessionName", sessId:"sessId"};
    DrupalSession.create(user);
    expect(DrupalSession.user).toEqual('user');
    expect(DrupalSession.sessionName).toEqual('sessionName');
    expect(DrupalSession.sessId).toEqual('sessId');
  }));

  // Destroy, DrupalSession service.
  it('Should destroy a session', inject(function(DrupalSession) {
    var user = {user:"user", sessionName:"sessionName", sessId:"sessId"};
    DrupalSession.create(user);
    DrupalSession.destroy();
    expect(DrupalSession.user).toEqual(null);
    expect(DrupalSession.sessionName).toEqual(null);
    expect(DrupalSession.sessId).toEqual(null);
  }))

});