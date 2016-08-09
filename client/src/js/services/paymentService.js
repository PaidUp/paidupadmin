'use strict'

module.exports = ['$resource', 'ConfigService', function ($resource, ConfigService) {
  
  var accountServices = $resource(ConfigService.getBrokerUrl()+'/api/v1/payment/account/:action', {}, {})

  var brands = {
    'Visa': 'cc-visa',
    'MasterCard': 'cc-mastercard',
    'American Express': 'cc-amex',
    'Discover': 'cc-discover',
    'Diners Club': 'cc-diners-club',
    'JCB': 'cc-jcb',
    'bank_account': 'university'
  }

  var paymentMethod = {
    'card': true,
    'bank': true,
    'bitcoin': true
  }

  this.getBrandCardClass = function (stripeBrand) {
    return brands[stripeBrand] || 'credit-card'
  }

  this.getPaymentMethod = function (key) {
    return paymentMethod[key]
  }

  this.setPaymentMethod = function (key, value) {
    paymentMethod[key] = value
  }

  this.listAccounts = function (userId) {
    return accountServices.get({ action: 'list' }).$promise
  }
}]
