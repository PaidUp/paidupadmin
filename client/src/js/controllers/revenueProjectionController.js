/**
 * Created by riclara on 7/5/16.
 */
'use strict';

module.exports = ['$scope', '$rootScope', 'ReportsService',
  function ($scope, $rootScope, ReportsService) {
    var fileName = '';
    var columnHeaders = {
      projection : ['Date', 'Organization Id', 'Organization', 'Location', 'To Be Charged', 'Stripe Fee', 'Expected Revenue', 'Total Fee'],
      revenue: ['Date', 'Organization Id', 'Organization', 'Location', 'Charged', 'Stripe Fee', 'Revenue', 'Total Fee']
    };

    $scope.init = function(){
      $scope.loadReport('retrieveRevenueProjection');
      $scope.columnHeaders = columnHeaders.projection
    }

    $scope.loadReport = function loadReport(name) {
      if(name === 'retrieveRevenueProjection'){
        fileName = 'revenueProjection';
        $scope.columnHeaders = columnHeaders.projection;
      } else if(name === 'retrieveRevenue'){
        fileName = 'revenue';
        $scope.columnHeaders = columnHeaders.revenue;        
      }
            
      ReportsService[name]({}).then(function (res) {
        $scope.data = res.data.map(function (projection) {
          return {
            date: projection._id.month + '/' + projection._id.year,
            organizationId: projection._id.organizationId,
            organizationName: projection._id.organizationName,
            organizationLocation: projection._id.organizationLocation,
            price: projection.value.price,
            stripeFee: projection.value.stripeFee,
            paidupFee: projection.value.paidupFee,
            totalFee: projection.value.totalFee
          }
        });
      }).catch(function (err) {
        console.log(err)
      })
    }



    $scope.fileName = function () {
      var today = new Date()
      return fileName + today.toLocaleString().substring(0, 18) + '.csv';
    }

    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
    );


  }
]
