/**
 * Created by riclara on 7/5/16.
 */
'use strict';

module.exports = ['$scope', '$rootScope', 'ReportsService',
  function ($scope, $rootScope, ReportsService) {
    
    $scope.data = ReportsService.retrieveRevenueProjection({}).then(function(res){
      $scope.data = res.data;
    }).catch(function(err){
      console.log(err)
    })

 
  }
]
