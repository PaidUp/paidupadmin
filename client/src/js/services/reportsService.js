'use strict'

module.exports = ['$cookieStore', '$resource', 'ConfigService', function ($cookieStore, $resource, ConfigService) {

  var revenueProjection = $resource(ConfigService.getBrokerUrl() + '/api/v1/reports/revenue/projection', {}, {
    post: { method: 'POST', isArray: false }
  })

  this.retrieveRevenueProjection = function (filter) {
    return revenueProjection.post({ filter: filter }).$promise
  }

 
}]
