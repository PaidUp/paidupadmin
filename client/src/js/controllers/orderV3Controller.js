'use strict';

module.exports = ['$scope', 'CommerceService', 'PaymentService',
  function ($scope, CommerceService, PaymentService) {

    $scope.searchCriteria = '';
    $scope.loading = false;
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>';
    $scope.expandSection1 = false;


    $scope.search = function () {
      $scope.loading = true;
      $scope.accounts = []
      $scope.orderSelected = null

      CommerceService.orderSearch ($scope.searchCriteria).then (function (result) {
        $scope.searchResult = result.body.orders
      }).catch (function (err) {

        $scope.loading = false
      })
    }

    $scope.selectOrder = function (order) {
      console.log('order', order);

      PaymentService.listAccounts(order.userId).then(function (res) {
        $scope.accounts = res.data
        console.log('data: ', res.data);

      }).catch(function (err) {
        console.log('ERR', err)
      })


      $scope.expandSection1 = !$scope.expandSection1;
    }

    $scope.closeDatePicker = function (id) {
      var selectedDay = angular.element ('#' + id + '_root').find ('.picker__day--selected').length
      if (selectedDay) {
        angular.element ('#' + id + '_root').find ('.picker__close').click ()
      }
    }
  }
]


