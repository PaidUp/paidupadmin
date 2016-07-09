'use strict';

module.exports = ['$scope', 'CommerceService',
  function ($scope, CommerceService) {

    $scope.searchCriteria = '';
    $scope.loading = false;
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>';


    $scope.search = function () {
      $scope.loading = true;
      $scope.accounts = []
      $scope.orderSelected = null

      CommerceService.orderSearch ($scope.searchCriteria).then (function (result) {
        $scope.searchResult = result.body.orders
        $scope.loading = false
      }).catch (function (err) {

        $scope.loading = false
      })
    }

    $scope.closeDatePicker = function (id) {
      var selectedDay = angular.element ('#' + id + '_root').find ('.picker__day--selected').length
      if (selectedDay) {
        angular.element ('#' + id + '_root').find ('.picker__close').click ()
      }
    }
  }
]


