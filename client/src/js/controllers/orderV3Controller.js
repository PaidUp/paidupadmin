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
    $scope.ordersHistory = [];
    $scope.customInfo = [];

    $scope.search = function () {
      if (!$scope.searchCriteria) {
        DialogService.warn('Please fill form');
        return;
      }
      $scope.loadingOrder = '';
      $scope.accountsFilter = {};
      $scope.expandSection = '',
        $scope.editCharges = '';

      CommerceService.orderSearch($scope.searchCriteria).then(function (result) {

        $scope.searchResult = result.body.orders
        DialogService.info(result.body.orders.length + ' results');
        $scope.loading = false
      }).catch(function (err) {
        $scope.loading = false
        DialogService.danger('There are a problem, please contact us');
      })
    }

    function loadCustomInfo(order) {
      $scope.customInfo = [];
      if (order.paymentsPlan[0].beneficiaryInfo && order.paymentsPlan[0].beneficiaryInfo.beneficiaryName) {
        $scope.customInfo.push({
          fieldTitle: 'Beneficiary Name',
          fieldValue: order.paymentsPlan[0].beneficiaryInfo.beneficiaryName
        })
      }
      if (order.paymentsPlan[0].customInfo) {
        var formTemplate = order.paymentsPlan[0].customInfo.formTemplate;
        var formData = order.paymentsPlan[0].customInfo.formData;

        formTemplate.forEach(function (ft, fdIdx, fdArr) {
          $scope.customInfo.push({
            fieldTitle: ft.name,
            fieldValue: formData[ft.model]
          })
        });
      }
    }

    function sortAccountFilter(order) {
      $scope.accountsFilter = {};
      order.paymentsPlan.forEach(function (ele, idx, arr) {
        if (!$scope.accountsFilter[ele._id]) {
          $scope.accountsFilter[ele._id] = [];
        }

        if (!ele.paymentMethods || ele.paymentMethods.length === 0) {
          ele.paymentMethods = ['card']
        }

        ele.paymentMethods.forEach(function (pm, idxPm, arrPm) {
          $scope.accounts.map(function (acc) {
            if (acc.object.indexOf(pm) === 0) {
              $scope.accountsFilter[ele._id].push(acc)
            }
          })
        })
      });
    }

    function loadAccountFileter(order, cb) {
      PaymentService.listAccounts(order.userId).then(function (res) {
        $scope.accounts = res.data
        sortAccountFilter(order);
        cb();
      }).catch(function (err) {
        console.log('ERR', err)
        DialogService.danger('There are a problem, please contact us');
      })
    }

    $scope.selectOrder = function (order) {
      $scope.loadingOrder = order._id;
      $scope.accountsFilter = {};
      $scope.editCharges = '';

      if ($scope.expandSection !== order._id) {
        $scope.expandSection = order._id;
        loadAccountFileter(order, function () {
          $scope.loadingOrder = '';
        });
        loadCustomInfo(order);
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
        originalPrice: pp.price / (1 - pp.discount/100),
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

    $scope.addPaymentplan = function (order, pp) {
      if (!$scope.newPaymentPlan.description || !$scope.newPaymentPlan.dateCharge || !$scope.newPaymentPlan.price ||
        !$scope.newPaymentPlan.account) {
        DialogService.warn('All fields are required');
        return
      }
      if (isNaN(parseFloat($scope.newPaymentPlan.price))) {
        DialogService.warn('Charge price:\n must be a number.');
        return;
      }

      var objAccount = $scope.accounts.filter(function (ele) {
        if ($scope.newPaymentPlan.account === ele.id) {
          return ele
        }
      })

      if (!objAccount || objAccount.length < 1) {
        DialogService.danger('A payment method is required');
        return
      }
      $scope.newPaymentPlan.orderId = order._id;
      $scope.newPaymentPlan.account = objAccount[0].id
      $scope.newPaymentPlan.accountBrand = objAccount[0].brand || objAccount[0].bankName
      $scope.newPaymentPlan.last4 = objAccount[0].last4
      $scope.newPaymentPlan.typeAccount = objAccount[0].object
      $scope.newPaymentPlan.originalPrice =  $scope.newPaymentPlan.price / (1 - pp.discount/100),


      CommerceService.paymentPlanAdd($scope.newPaymentPlan).then(function (res) {
        $scope.newPaymentPlan = {}
        order.paymentsPlan = res.paymentsPlan;

        DialogService.ok('Payment was added successfully');

        $scope.submitted = false
        //$scope.editCharges = '';
        //$scope.loadingOrder = order._id;
        sortAccountFilter(order);


      }).catch(function (err) {
        console.log('ERR: ', err)
        DialogService.danger('Payment wasn`t added, please contact us');
      })
    }

    $scope.changeToEdit = function (orderId) {
      $scope.editCharges = orderId;
    }

    $scope.closeDatePicker = function (id) {
      var selectedDay = angular.element('#' + id + '_root').find('.picker__day--selected').length
      if (selectedDay) {
        angular.element('#' + id + '_root').find('.picker__close').click()
      }
    }

    $scope.completeHistory = function () {
      $scope.ordersHistory = [];
    }

    $scope.loadHistory = function (orderId) {
      CommerceService.orderHistory(orderId).then(function (res) {
        $scope.ordersHistory = res.body.orders;
      }).catch(function (e) {
        console.log(e);
        DialogService.danger('There are a problem, please contact us');
      });
    }
  }]


