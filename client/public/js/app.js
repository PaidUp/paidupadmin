'use strict'

/* global angular */
angular.module('PaidUpAdmin', ['ui.bootstrap'])

  .controller('PaidUpCtrl', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    $rootScope.GlobalAlertSystemAlerts = [
      { type: 'danger', msg: 'This has a timeout it will dismiss in 2 seconds', dismissOnTimeout: 2000 },
      { type: 'success', msg: 'This do not have a timeout it will stay until closed' },
      { type: 'warning', msg: 'This do not have a timeout it will stay until closed' }
    ]
    $timeout(function () {
      $rootScope.GlobalAlertSystemAlerts.push({ type: 'info', msg: 'This shows hot to set alert progrmatically' })
    }, 5000)
  }])
  .run(['$rootScope', function ($rootScope) {
    $rootScope.GlobalAlertSystemClose = function (index) {
      $rootScope.GlobalAlertSystemAlerts.splice(index, 1)
    }
  }])
