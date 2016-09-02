'use strict'

module.exports = ['$cookieStore', '$resource', 'ConfigService', function ($cookieStore, $resource, ConfigService) {

  var revenueProjection = $resource(ConfigService.getBrokerUrl() + '/api/v1/reports/revenue/projection', {}, {
    post: { method: 'POST', isArray: false }
  })

  var revenue = $resource(ConfigService.getBrokerUrl() + '/api/v1/reports/revenue', {}, {
    post: { method: 'POST', isArray: false }
  })

  this.retrieveRevenueProjection = function (filter) {
    return revenueProjection.post({ filter: filter }).$promise
  }

  this.retrieveRevenue = function (filter) {
    return revenue.post({ filter: filter }).$promise
  }

 
}]
