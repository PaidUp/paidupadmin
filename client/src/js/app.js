'use strict'

var angular = require('angular')
require('angular-ui-router')
require('angular-resource')
require('angular-sanitize')
require('angular-cookies')
require('angular-translate')
require('angular-animate')
//require('./vendor/angular-facebook')
require('./vendor/alert.min')
// require('./vendor/mixpanel')
require('angular-ui-bootstrap')
require('angulartics')
require('angulartics-google-analytics')
require('angular-ui-mask')
require('angular-local-storage')

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
