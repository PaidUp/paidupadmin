'use strict'
var englishTranslations = require('../translations/en')
var spanishTranslations = require('../translations/es')

module.exports = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', '$httpProvider', 'uiMask.ConfigProvider', '$provide', 'localStorageServiceProvider', 
  function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $httpProvider, uiMaskConfigProvider, $provide, localStorageServiceProvider) {
  // UI MAsk
  uiMaskConfigProvider.clearOnBlur(false)
  uiMaskConfigProvider.maskDefinitions({'D': /^[0-9]*$/})

  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })

  localStorageServiceProvider
      .setPrefix('paidUpAdmin')
      .setStorageType('sessionStorage')
      .setNotify(true, true)
    
  // HTTP INTERCEPTORS
  $httpProvider.interceptors.push('AuthInterceptor')

  // TRANSLATE MODULE CONFIG
  $translateProvider.translations('en', englishTranslations)

  $translateProvider.translations('es', spanishTranslations)

  $translateProvider.preferredLanguage('en')
  $translateProvider.useSanitizeValueStrategy('sanitize')

  // UI ROUTER
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/logout')
  //
  // Now set up the states
  $stateProvider
    .state('logout', {
      url: '/logout',
      templateUrl: '../../templates/main/index.html',
      data: {
        requireLogin: false
      }
    })
    .state('access', {
      url: '/access',
      controller: 'SsoCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('orders', {
    url: '/orders',
    templateUrl: '../../templates/orders/ordersV3.html',
    controller: 'OrderV3Ctrl',
    data: {
      requireLogin: true
    }
  })
}
]
