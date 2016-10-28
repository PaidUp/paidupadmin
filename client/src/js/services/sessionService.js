'use strict'

module.exports = [ '$rootScope', '$cookies', function ($rootScope, $cookies) {
  var SessionService = this
  $rootScope.$on('logout', function () {
    SessionService.removeCurrentSession()
  })

  this.addSession = function (data) {
    $cookies.put('token', data.token)
  }

  this.removeCurrentSession = function () {
    $cookies.remove('token')
  }

  this.getCurrentSession = function () {
    return $cookies.get('token')
  }
}]
