/**
 * Created by riclara on 7/5/16.
 */
'use strict';

module.exports = ['$scope', '$rootScope', 'ReportsService',
  function ($scope, $rootScope, ReportsService) {

    $scope.init = function(){
      $scope.loadReport('retrieveRevenueProjection')
    }

    $scope.loadReport = function loadReport(name) {
      ReportsService[name]({}).then(function (res) {
        $scope.data = res.data.map(function (projection) {
          return {
            date: projection._id.month + '/' + projection._id.year,
            organizationId: projection._id.organizationId,
            organizationName: projection._id.organizationName,
            organizationLocation: projection._id.organizationLocation,
            price: projection.price,
            stripeFee: projection.stripeFee,
            paidupFee: projection.paidupFee,
            totalFee: projection.totalFee
          }
        });
      }).catch(function (err) {
        console.log(err)
      })
    }



    $scope.fileName = function () {
      var today = new Date()
      return 'revenueProjections' + today.toISOString().substring(0, 10) + '.csv';
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
