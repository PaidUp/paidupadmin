'use strict'
var angular = require('angular')

module.exports = [ '$resource', 'ConfigService', function ($resource, ConfigService) {
  // ============= User Service =============

  var User = $resource(ConfigService.getBrokerUrl()+'/api/v1/user/:action/:userId', {
    userId: ''
  }, {
    post: { method: 'POST', isArray: true }
  })

  this.get = function (token, callback) {
    var cb = callback || angular.noop
    return User.get({action: 'current', token: token}, cb)
  // return User.get({token: token}, cb)
  }

  this.getUser = function (userId) { // change name
    return User.post({}, {_id: userId}).$promise
  }

  
}]
