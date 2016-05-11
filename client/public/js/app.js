'use strict'

/* global angular */
angular.module('PaidUpAdmin', ['ui.bootstrap'])

  .controller('PaidUpCtrl', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    $timeout(function () {
      $rootScope.GlobalAlertSystemAlerts.push({ type: 'info', msg: 'This shows hot to set alert progrmatically', dismissOnTimeout: 1000 })
    }, 2000)
  }])
  .run(['$rootScope', function ($rootScope) {
    $rootScope.GlobalAlertSystemAlerts = []
    $rootScope.GlobalAlertSystemClose = function (index) {
      $rootScope.GlobalAlertSystemAlerts.splice(index, 1)
    }
  }])
