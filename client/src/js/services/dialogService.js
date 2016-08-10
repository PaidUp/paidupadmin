
'use strict'

module.exports = ['$rootScope', function ($rootScope) {
  var DialogService = this

  var typeColor = {
    info: 'light-blue darken-1',
    ok: 'teal darken-1',
    warn: 'orange darken-1',
    danger: 'red darken-1'
  }

  DialogService.info = function (message, duration, cb) {
    setDialog('info', message, duration, cb);
  }

  DialogService.ok = function (message, duration, cb) {
    setDialog('ok', message, duration, cb);
  }

  DialogService.warn = function (message, duration, cb) {
    setDialog('warn', message, duration, cb);
  }

  DialogService.danger = function (message, duration, cb) {
    setDialog('danger', message, duration, cb);
  }

  function setDialog(type, message, duration, cb) {
    if (!message) {
      throw Error('Message is required')
    }
    var color = typeColor[type];
    var time = duration || 10000;
    if (!color) {
      throw Error('Type must be: info, ok, warn or danger')
    }
    Materialize.toast(message, time, color, cb);
  }



}]
