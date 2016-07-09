'use strict'

module.exports = [ '$rootScope', '$location', function ($rootScope, $location) {
  var ConfigService = this


  ConfigService.getBrokerUrl = function () {
    var host = $location.host();
    var brokerUrl = ''

    if(host.indexOf('admin') === 0){
      brokerUrl = 'https://app.getpaidup.com';
    }
    else if(host.indexOf('admstg') === 0){
      brokerUrl = 'https://stg.getpaidup.com';
    }
    else if(host.indexOf('admdev') === 0){
      brokerUrl = 'https://dev.getpaidup.com';
    }
    else {
      brokerUrl = 'http://localhost:9000'
    }
    return brokerUrl;
  }

  ConfigService.getPaidUpUrl = function () {
    var host = $location.host();
    var brokerUrl = ''

    if(host.indexOf('admin') === 0){
      brokerUrl = 'https://app.getpaidup.com';
    }
    else if(host.indexOf('admstg') === 0){
      brokerUrl = 'https://stg.getpaidup.com';
    }
    else if(host.indexOf('admdev') === 0){
      brokerUrl = 'https://dev.getpaidup.com';
    }
    else {
      brokerUrl = 'http://localhost:9000'
    }
    return brokerUrl;
  }


}]
