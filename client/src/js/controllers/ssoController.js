'use strict';

module.exports = ['$scope', '$state', '$rootScope', '$stateParams', '$location', 'SessionService', '$http', 'UserService',
  function ($scope, $state, $rootScope, $stateParams, $location, SessionService, $http, UserService) {

    var data = {token:$stateParams.token};

    SessionService.addSession(data);
    UserService.get(data.token, function(user){
      $rootScope.currentUser = user;

      $location.path('/orders')

      console.log('$location.path', $location.path());
      $location.replace();

      //$state.go(AuthService.getDest());
      //AuthService.setDest();
    });




  }
  
]


