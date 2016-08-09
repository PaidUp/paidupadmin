'use strict';

module.exports = ['$scope', '$state', '$rootScope', '$stateParams', '$location', 'SessionService', '$http', 'UserService',
  function ($scope, $state, $rootScope, $stateParams, $location, SessionService, $http, UserService) {

    var data = {token:$location.search().token};
    
    console.log('data: ', data);

    SessionService.addSession(data);
    UserService.get(data.token, function(user){
      if (user && user.roles && user.roles.indexOf('admin') > -1){
        $rootScope.currentUser = user;
        $location.url($location.path());
        $location.path('/orders')
        $location.replace();
        $state.go('orders');
      } else {
        $location.path('/logout')
        $location.replace();
        $state.go('logout');
      }
      
    });




  }
  
]


