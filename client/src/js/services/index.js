'use strict'
var app = require('angular').module('PaidUpAdmin')

app.service('UserService', require('./userService'))
app.service('SessionService', require('./sessionService'))
app.factory('AuthService', require('./authService'))
app.factory('AuthInterceptor', require('./authInterceptor'))
app.service('ConfigService', require('./configService'))
app.service('CommerceService', require('./commerceService'))
app.service('PaymentService', require('./paymentService'))
app.service('DialogService', require('./dialogService'))
app.service('ReportsService', require('./reportsService'))