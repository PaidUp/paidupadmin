'use strict'
require('jquery')
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
require('./vendor/materialize.min')
require('angular-materialize');

/* global angular */
var PaidUpAdmin = angular.module('PaidUpAdmin', [
  'ui.bootstrap',
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'ngAnimate',
  'pascalprecht.translate',
  'ui.mask',
  'LocalStorageModule',
  'ui.bootstrap',
  'ui.materialize'
  ]);

PaidUpAdmin.config(require('./config/appConfig'))
PaidUpAdmin.run(require('./config/appRun'))

require('./services')
require('./controllers')
  
  
 
