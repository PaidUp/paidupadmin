/**
 * Created by riclara on 7/5/16.
 */
'use strict';

module.exports = ['$scope', '$rootScope', 'AuthService', '$window', 'ConfigService',
  function ($scope, $rootScope, AuthService, $window, ConfigService) {
    
    $scope.user = AuthService.getCurrentUser();

    $scope.logout = function () {
      AuthService.logout();
      $window.location.href = ConfigService.getPaidUpUrl();
    }


  }

]
