'use strict'

module.exports = ['$resource', 'ConfigService', function ($resource, ConfigService) {
  
  var urlAccountServices = ConfigService.getBrokerUrl()+'/api/v1/payment/account/:action/:userId';
  var accountServices = $resource(urlAccountServices, {}, {})

  var urlRefund = ConfigService.getBrokerUrl()+'/api/v1/payment/refund';
  var refundResource = $resource(urlRefund, {}, {
    post: { method: 'POST', isArray: false }
  })

  var urlRetrieveTransfer = ConfigService.getBrokerUrl()+'/api/v1/payment/transfer/retrieve/:transferId';
  var retrieveTransferResource = $resource(urlRetrieveTransfer, {}, {})

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
    return accountServices.get({ action: 'list', userId: userId }).$promise
  }

  this.refund = function (chargeId, reason, amount) {
    return refundResource.post({ chargeId: chargeId, reason: reason, amount: amount }).$promise
  }

  this.retrieveTransfer = function (transferId) {
    return retrieveTransferResource.get({ transferId: transferId}).$promise
  }
}]
