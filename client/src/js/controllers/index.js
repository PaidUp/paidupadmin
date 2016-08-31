'use strict'
var app = require('angular').module('PaidUpAdmin')

app.controller('SsoCtrl', require('./ssoController'))
app.controller('MenuCtrl', require('./menuController'))
app.controller('OrderV3Ctrl', require('./orderV3Controller'))
app.controller('RevenueProjection', require('./revenueProjectionController'))
//require('./dashboard')
