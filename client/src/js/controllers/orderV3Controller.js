'use strict';

module.exports = ['$scope', 'CommerceService', 'PaymentService', 'DialogService',
  function ($scope, CommerceService, PaymentService, DialogService) {

    $scope.searchCriteria = '';
    $scope.loading = false;
    $scope.loadingOrder = false;
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>';
    $scope.expandSection1 = false;
    $scope.newPaymentPlan = {};
    $scope.expandSection = {};


    $scope.search = function () {
      $scope.loading = true;
      $scope.accounts = []
      $scope.orderSelected = null

      CommerceService.orderSearch($scope.searchCriteria).then(function (result) {
        $scope.searchResult = result.body.orders
        $scope.loading = false
      }).catch(function (err) {
        $scope.loading = false
        DialogService.danger('There are a problem, please contact us');
      })
    }

    $scope.selectOrder = function (order) {
      $scope.loadingOrder = true;
      $scope.orderSelected = order;
      $scope.newPaymentPlan = {};
      $scope.accountsFilter = {}
      PaymentService.listAccounts(order.userId).then(function (res) {
        $scope.accounts = res.data
        

        order.paymentsPlan.forEach(function(ele, idx, arr){
          if(!$scope.accountsFilter[ele._id]){
            $scope.accountsFilter[ele._id] = [];
          }

          ele.paymentMethods.forEach(function(pm, idxPm, arrPm){
            res.data.map(function(acc){
              console.log('acc.object',acc.object)
              console.log('pm',pm)
              console.log('acc.object.indexOf(pm)',acc.object.indexOf(pm))
              if(acc.object.indexOf(pm) === 0){
                $scope.accountsFilter[ele._id].push(acc)
              }
            })
          })
        });

        console.log('data: ', res.data);
        $scope.loadingOrder = false;

      }).catch(function (err) {
        console.log('ERR', err)
        DialogService.danger('There are a problem, please contact us');
      })
      $scope.expandSection = {};
      $scope.expandSection[order._id] = !$scope.expandSection[order._id];
    }

    $scope.editPaymentPlan = function (pp) {
      $scope.loadingOrder = true;
      if (!$scope.orderSelected._id || !pp.originalPrice || !pp.description || !pp.dateCharge) {
        DialogService.warm('All fields are required');
        return
      }

      var objAccount = $scope.accounts.filter(function (ele) {
        if (pp.account === ele.id) {
          return ele
        }
      })

      if (!objAccount || objAccount.length < 1) {
        DialogService.danger('A payment method is required');
        return
      }

      pp.account = objAccount[0].id
      pp.accountBrand = objAccount[0].brand || objAccount[0].bankName
      pp.last4 = objAccount[0].last4
      pp.typeAccount = objAccount[0].object


      var params = {
        version: pp.version || 'v1',
        orderId: $scope.orderSelected._id,
        paymentPlanId: pp._id,
        originalPrice: pp.originalPrice,
        description: pp.description,
        dateCharge: pp.dateCharge,
        wasProcessed: pp.wasProcessed,
        account: pp.account,
        accountBrand: pp.accountBrand,
        last4: pp.last4,
        typeAccount: pp.typeAccount,
        status: pp.status
      }

      $scope.submitted = true

      CommerceService.paymentPlanEdit(params).then(function (res) {
        DialogService.ok('Order was updated successfully');
        $scope.loadingOrder = false;
      }).catch(function (err) {
        DialogService.danger('Order cannot be updated, please contact us');
        $scope.loadingOrder = false;
        console.log('ERR: ', err)
      })
    }

    $scope.closeDatePicker = function (id) {
      var selectedDay = angular.element('#' + id + '_root').find('.picker__day--selected').length
      if (selectedDay) {
        angular.element('#' + id + '_root').find('.picker__close').click()
      }
    }
  }
]


