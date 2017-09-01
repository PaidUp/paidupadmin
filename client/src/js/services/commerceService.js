'use strict'

module.exports = ['$cookieStore', '$resource', 'ConfigService', function ($cookieStore, $resource, ConfigService) {

  var OrderSearch = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/search', {}, {
    post: { method: 'POST', isArray: false }
  })

  var OrderCancel = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/cancel', {}, {
    post: { method: 'POST', isArray: false }
  })

  var OrderActivate = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/activate', {}, {
    post: { method: 'POST', isArray: false }
  })

  var OrderPaymentRemove = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/payment/remove', {}, {
    post: { method: 'POST', isArray: false }
  })

  var PaymentPlanEdit = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/edit', {}, {
    post: { method: 'POST', isArray: false }
  })

   var PaymentPlanAdd = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/add', {}, {
    post: { method: 'POST', isArray: false }
  })

  var OrderHistory = $resource(ConfigService.getBrokerUrl() + '/api/v1/commerce/order/history', {}, {
    post: { method: 'POST', isArray: false }
  })


  this.orderSearch = function (params) {
    var body = { params: params };
    return OrderSearch.post(body).$promise
  }

  this.orderCancel = function (orderId) {
    var body = { orderId: orderId };
    return OrderCancel.post(body).$promise
  }

  this.orderActivate = function (orderId) {
    var body = { orderId: orderId };
    return OrderActivate.post(body).$promise
  }

  this.orderPaymentRemove = function (orderId, paymentPlanId) {
    var body = { 
      orderId: orderId, 
      paymentPlanId: paymentPlanId
    };
    return OrderPaymentRemove.post(body).$promise
  }

  this.paymentPlanEdit = function (params) {
    return PaymentPlanEdit.post(params).$promise
  }

  this.paymentPlanAdd = function (params) {
    return PaymentPlanAdd.post(params).$promise
  }

  this.orderHistory = function (orderId) {
    return OrderHistory.post({orderId : orderId}).$promise
  }

  var Orders = $resource('/api/v1/commerce/order/list', {}, {})
  var Order = $resource('/api/v1/commerce/order/:orderId', {}, {})
  var OrderBasic = $resource('/api/v1/commerce/order/basic/:orderId', {}, {})
  var Transactions = $resource('/api/v1/commerce/transaction/list', {}, {})
  var Schedule = $resource('/api/v1/commerce/schedule/generate', {}, {
    post: { method: 'POST', isArray: false }
  })

  this.getOrders = function () {
    return Orders.query().$promise
  }

  this.getOrder = function (orderId) {
    return Order.get({ orderId: orderId }).$promise
  }

  this.getOrderBasic = function (orderId) {
    return OrderBasic.get({ orderId: orderId }).$promise
  }

  this.getUsertransactions = function () {
    return Transactions.query().$promise
  }

  this.getSchedule = function (productId, price, isInFullPay, discount) {
    return Schedule.post({ productId: productId, price: price, isInFullPay: isInFullPay, discount: discount }).$promise
  }
}]
