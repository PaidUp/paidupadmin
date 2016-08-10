'use strict';

module.exports = ['$scope', 'CommerceService', 'PaymentService', 'DialogService',
  function ($scope, CommerceService, PaymentService, DialogService) {

    $scope.searchCriteria = '';
    $scope.loading = false;
    $scope.loadingOrder = '';
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>';
    $scope.newPaymentPlan = {};
    $scope.expandSection = '';
    $scope.accountsFilter = {};


    $scope.search = function () {
      if (!$scope.searchCriteria) {
        DialogService.warn('Please fill form');
        return;
      }
      $scope.loadingOrder = '';
      $scope.accountsFilter = {};
      $scope.expandSection = '',

      CommerceService.orderSearch($scope.searchCriteria).then(function (result) {

        $scope.searchResult = result.body.orders
        DialogService.info(result.body.orders.length+' results');
        $scope.loading = false
      }).catch(function (err) {
        $scope.loading = false
        DialogService.danger('There are a problem, please contact us');
      })
    }

    $scope.selectOrder = function (order) {
      $scope.loadingOrder = order._id;
      $scope.accountsFilter = {};

      $scope.editCharges = '';

      if ($scope.expandSection !== order._id) {
        $scope.expandSection = order._id;
        PaymentService.listAccounts(order.userId).then(function (res) {
          $scope.accounts = res.data


          order.paymentsPlan.forEach(function (ele, idx, arr) {
            if (!$scope.accountsFilter[ele._id]) {
              $scope.accountsFilter[ele._id] = [];
            }

            if(!ele.paymentMethods || ele.paymentMethods.length === 0){
              ele.paymentMethods = ['card']
            }

            ele.paymentMethods.forEach(function (pm, idxPm, arrPm) {
              res.data.map(function (acc) {
                if (acc.object.indexOf(pm) === 0) {
                  $scope.accountsFilter[ele._id].push(acc)
                }
              })
            })
          });
          $scope.loadingOrder = '';
        }).catch(function (err) {
          console.log('ERR', err)
          DialogService.danger('There are a problem, please contact us');
        })
      } else {
        $scope.loadingOrder = '';
        $scope.expandSection = '';
      }


    }

    $scope.editPaymentPlan = function (orderId, pp) {
      $scope.loadingOrder = orderId;
      if (!pp.price || !pp.description || !pp.dateCharge) {
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
        orderId: orderId,
        paymentPlanId: pp._id,
        originalPrice: pp.discount === 0 ? pp.price : pp.price * 100 / pp.discount,
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
        $scope.loadingOrder = '';
      }).catch(function (err) {
        DialogService.danger('Order cannot be updated, please contact us');
        $scope.loadingOrder = '';
        console.log('ERR: ', err)
      })
    }

    $scope.changeToEdit = function(orderId){
      $scope.editCharges = orderId;
    }

    $scope.closeDatePicker = function (id) {
      var selectedDay = angular.element('#' + id + '_root').find('.picker__day--selected').length
      if (selectedDay) {
        angular.element('#' + id + '_root').find('.picker__close').click()
      }
    }
  }
]


