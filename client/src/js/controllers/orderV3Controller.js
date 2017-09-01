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
        originalPrice: pp.price / (1 - pp.discount / 100),
        description: pp.description,
        dateCharge: pp.dateCharge.substring(0, 10) + " 10:00",
        wasProcessed: pp.wasProcessed,
        account: pp.account,
        accountBrand: pp.accountBrand,
        last4: pp.last4,
        typeAccount: pp.typeAccount,
        status: pp.status,
        attempts: pp.attempts
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
      $scope.newPaymentPlan.originalPrice = $scope.newPaymentPlan.price / (1 - pp.discount / 100),


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

    $scope.changeToEdit = function (orderId, index) {
      if (orderId.length === 0) {
        $scope.loading = true;
        CommerceService.orderSearch($scope.searchResult[index].orderId).then(function (result) {
          $scope.searchResult.splice(index, 1, result.body.orders[0]);
          $scope.loading = false
          $scope.editCharges = '';
        }).catch(function (err) {
          $scope.loading = false
          DialogService.danger('There are a problem, please contact us');
        })
      } else {
        $scope.editCharges = orderId;
      }

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

    $scope.retrieveTransfer = function (orderId, pp) {
      $scope.refundObj = {}
      pp.attempts.forEach(function (attemp, idx, arr) {
        if (attemp.status === 'succeeded') {
          PaymentService.retrieveTransfer(attemp.transferId).then(function (transfer) {
            $scope.refundObj.chargeId = transfer.source_transaction;
            $scope.refundObj.pp = pp;
            $scope.refundObj.orderId = orderId;
            $scope.refundObj.reason = '';
            $('#modalRefund').openModal();
          }).catch(function (err) {
            DialogService.danger('There are a problem, please contact us');
            console.log(err)
          })
        }
      });
    }

    $scope.refund = function () {
      $scope.processRefud = true;
      if (!$scope.refundObj.reason) {
        DialogService.warn('A reason is required');
        $scope.processRefud = false;
        return;
      }
      if ($scope.refundObj.pp.status !== 'succeeded') {
        DialogService.danger('The status must be succeeded');
        return;
      }

      PaymentService.refund($scope.refundObj.chargeId, $scope.refundObj.reason).then(function (refund) {
        $scope.refundObj.pp.status = 'refunded';
        $scope.refundObj.pp.attempts.push({
          status: 'refunded',
          message: $scope.refundObj.reason,
          dateAttemp: new Date(),
          last4: $scope.refundObj.pp.last4,
          accountBrand: $scope.refundObj.pp.accountBrand,
          transferId: refund.id
        })
        $scope.editPaymentPlan($scope.refundObj.orderId, $scope.refundObj.pp);
        $('#modalRefund').closeModal();
        DialogService.ok('Refunded was applyed');
        $scope.processRefud = false;
      }).catch(function (err) {
        $scope.processRefud = false;
        DialogService.danger('There are a problem, please contact us');
        console.log(err);
      })

    }

    $scope.retry = function (orderId, pp) {
      if (pp.status === 'failed') {
        pp.status = 'pending'
        pp.wasProcessed = false;
        $scope.editPaymentPlan(orderId, pp);
      } else {
        DialogService.danger('The status must be failed');
      }
    }

    $scope.confirmDisable = function (orderId, pp) {
      $('#confirmDisableModal').openModal();
      $scope.disableObj = {
        orderId: orderId,
        pp: pp
      }
    }

    $scope.disabled = function (confirm) {
      if (confirm) {
        if ($scope.disableObj.pp.status !== 'succeeded' || $scope.disableObj.pp.status !== 'refunded') {
          $scope.disableObj.pp.status = 'disable-' + $scope.disableObj.pp.status
          $scope.editPaymentPlan($scope.disableObj.orderId, $scope.disableObj.pp);
          $('#confirmDisableModal').closeModal();
        } else {
          DialogService.danger('The status must be failed');
          $('#confirmDisableModal').closeModal();

        }
      } else {
        $('#confirmDisableModal').closeModal();
        $scope.disableObj = {}
      }

    }

    $scope.enable = function (orderId, pp) {
      if (pp.status.startsWith('disable-')) {
        pp.status = pp.status.substring(8);
        $scope.editPaymentPlan(orderId, pp);
        $('#confirmDisableModal').closeModal();
      } else {
        DialogService.danger('The status must be failed');
        $('#confirmDisableModal').closeModal();

      }
    }

    $scope.confirmCancel = function (index, orderId) {
      $('#confirmCancelModal').openModal();
      $scope.cancelObj = {
        orderId: orderId,
        index: index
      }
    }

    $scope.confirmActivate = function (index, orderId) {
      $('#confirmActivateModal').openModal();
      $scope.activateObj = {
        orderId: orderId,
        index: index
      }
    }

    $scope.confirmRemove = function (index, orderId, paymentPlanId) {
      $('#confirmRemoveModal').openModal();
      $scope.removeObj = {
        orderId: orderId,
        paymentPlanId: paymentPlanId,
        index: index
      }
    }

    $scope.orderCancel = function (confirm) {
      if (confirm) {
        $scope.loading = true;
        CommerceService.orderCancel($scope.cancelObj.orderId).then(function (result) {
          $scope.searchResult[$scope.cancelObj.index] = result;
          $scope.loading = false;
          DialogService.ok('Order was canceled successfully');
          $('#confirmCancelModal').closeModal();
        }).catch(function () {
          DialogService.danger('Unable to cancel this order.');
          $scope.loading = false;
          $('#confirmCancelModal').closeModal();
        })
      } else {
        $('#confirmCancelModal').closeModal();
        $scope.cancelObj = {}
      }
    }

    $scope.orderActivate = function (confirm) {
      if (confirm) {
        $scope.loading = true;
        CommerceService.orderActivate($scope.activateObj.orderId).then(function (result) {
          $scope.searchResult[$scope.activateObj.index] = result;
          $scope.loading = false;
          DialogService.ok('Order was activated successfully');
          $('#confirmActivateModal').closeModal();
        }).catch(function () {
          DialogService.danger('Unable to activate this order.');
          $scope.loading = false;
          $('#confirmActivateModal').closeModal();
        })
      } else {
        $('#confirmActivateModal').closeModal();
        $scope.cancelObj = {}
      }
    }

    $scope.orderRemovePayment = function (confirm) {
      if (confirm) {
        $scope.loading = true;
        CommerceService.orderPaymentRemove($scope.removeObj.orderId, $scope.removeObj.paymentPlanId).then(function (result) {
          $scope.searchResult[$scope.removeObj.index] = result;
          $scope.loading = false;
          DialogService.ok('Payment was removed successfully');
          $('#confirmRemoveModal').closeModal();
        }).catch(function () {
          DialogService.danger('Unable to update this order.');
          $scope.loading = false;
          $('#confirmRemoveModal').closeModal();
        })
      } else {
        $('#confirmRemoveModal').closeModal();
        $scope.cancelObj = {}
      }
    }


  }]


