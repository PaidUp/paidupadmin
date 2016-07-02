'use strict'

module.exports = [ '$rootScope', '$location', function ($rootScope, $location) {
  var ConfigService = this


  ConfigService.getBrokerUrl = function () {
    var host = $location.host();
    var brokerUrl = ''

    if(host.indexOf('admin') === 0){
      brokerUrl = 'https://app.getpaidup.com';
    }
    else if(host.indexOf('adminstg') === 0){
      brokerUrl = 'https://stg.getpaidup.com';
    }
    else if(host.indexOf('admindev') === 0){
      brokerUrl = 'https://stg.getpaidup.com';
    }
    else {
      brokerUrl = 'http://localhost:9000'
    }
    return brokerUrl;
  }


}]
