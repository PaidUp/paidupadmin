'use strict'
var angular = require('angular')

module.exports = [ '$rootScope', '$http', 'UserService', 'SessionService', '$q', function ($rootScope, $http, UserService, SessionService, $q) {
  var ROLES_ROUTES = {
    USER: 'athletes',
    COACH: 'provider-request',
    COACH_SUCCESS: 'provider-success',
    DEFAULT: 'main'
  }

  if (SessionService.getCurrentSession()) {
    $rootScope.currentUser = UserService.get(SessionService.getCurrentSession())
  }

  $rootScope.$on('logout', function () {
    delete $rootScope.currentUser
  })

  var dest = 'signup'
  var isParent = true

  return {
    getDest: function () {
      return dest
    },

    getIsParent: function () {
      return isParent
    },

    destPath: function (value, parent) {
      dest = value
      isParent = parent
    },

    setDest: function () {
      dest = 'signup'
    },

    setIsParent: function () {
      isParent = true
    },

    setParent: function (_isParent) {
      isParent = _isParent
    },

    updateCurrentUser: function () {
      $rootScope.currentUser = UserService.get(SessionService.getCurrentSession())
    },

    updateCurrentUserSync: function (cb) {
      UserService.get(SessionService.getCurrentSession()).$promise.then(function (user) {
        cb(user)
      })
    },

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    logout: function () {
      SessionService.removeCurrentSession()
      delete $rootScope.currentUser
    },

    authorize: function (data) {
      if (data.pageDataRoles) {
        return data.pageDataRoles.some(function (role) {
          return data.userRoles.indexOf(role) !== -1
        })
      }
    },

    reLocation: function (roles, providerState) {
      if (roles.indexOf('coach') !== -1) {
        if (providerState === 'pending') {
          return ROLES_ROUTES.COACH_SUCCESS
        } else {
          return ROLES_ROUTES.COACH
        }
      } else if (roles.indexOf('user') !== -1) {
        return ROLES_ROUTES.USER
      } else {
        return ROLES_ROUTES.DEFAULT
      }
    },

    

    getSessionSalt: function (token, cb) {
      if (token) {
        $http.post('/api/v1/auth/session/salt', {
          token: token
        }).success(function (data) {
          cb(null, data)
        }).error(function (err) {
          console.log('err', err)
          cb(err)
        })
      } else {
        cb(null, true)
      }
    },
    
    getCurrentUser: function () {
      return $rootScope.currentUser
    },

    getCurrentUserPromise: function () {
      return $q(function (resolve, reject) {
        if (angular.isDefined($rootScope.currentUser)) {
          if ($rootScope.currentUser.hasOwnProperty('$promise')) {
            $rootScope.currentUser.$promise.then(function () {
              resolve($rootScope.currentUser)
            }).catch(function () {
              reject('error retrieving user')
            })
          } else {
            resolve($rootScope.currentUser)
          }
        } else {
          reject('user not logged in')
        }
      })
    },

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    isLoggedIn: function () {
      return angular.isDefined($rootScope.currentUser) // && $rootScope.currentUser.hasOwnProperty('role')
    },

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync: function (cb) {
      if (!angular.isDefined($rootScope.currentUser)) {
        cb(false)
        return
      } else if ($rootScope.currentUser.hasOwnProperty('$promise')) {
        $rootScope.currentUser.$promise.then(function () {
          cb(true)
        }).catch(function () {
          cb(false)
        })
      } else {
        cb(true)
      }
    },

    /**
     * Check if a user is an admin
     *
     * @return {Boolean}
     */
    isAdmin: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('admin') !== -1
      }
    },

    isCoach: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('coach') !== -1
      }
    },

    isUser: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('user') !== -1
      }
    },

    validateRole: function (role) {
      if (!role) {
        return false
      }

      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf(role) !== -1
      }
      return false
    },

    /**
     * Get auth token
     */
    getToken: function () {
      return SessionService.getCurrentSession()
    }

  }
}]
