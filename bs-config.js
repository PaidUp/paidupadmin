/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | Please report any issues you encounter:
 |  https://github.com/shakyShane/browser-sync/issues
 |
 | For up-to-date information about the options:
 |  https://github.com/shakyShane/browser-sync/wiki/Working-with-a-Config-File
 |
 */

var historyApiFallback = require('connect-history-api-fallback')

module.exports = {

  /*
   |--------------------------------------------------------------------------
   | Files to watch
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-files
   */
  files: ["client/dist"],

  port: 4000,

  /*
   |--------------------------------------------------------------------------
   | Directories or files to exclude
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-exclude
   */
  exclude: false,

  /*
   |--------------------------------------------------------------------------
   | Server
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-server
   */
  server: {
    baseDir: "./client/dist",
    middleware: [require("connect-logger")(), historyApiFallback()]

  },

  /*
   |--------------------------------------------------------------------------
   | Proxy
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-proxy
   */
  //proxy: {
  //  host: "wordpress.local"
  //},

  /*
   |--------------------------------------------------------------------------
   | Ghost Mode
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-ghostmode
   */
  //ghostMode: {
    //clicks: true,
    //links: true,
    //forms: true,
    //scroll: true
  //},

  /*
   |--------------------------------------------------------------------------
   | Open (true|false)
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-open
   */
  open: true,

  /*
   |--------------------------------------------------------------------------
   | Timestamps (true|false)
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-timestamps
   */
  timestamps: true,

  /*
   |--------------------------------------------------------------------------
   | File Timeout (milliseconds)
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-filetimeout
   */
  fileTimeout: 1000,

  /*
   |--------------------------------------------------------------------------
   | Inject Changes
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-injectchanges
   */
  injectChanges: true,

  /*
   |--------------------------------------------------------------------------
   | Scroll Throttle (milliseconds)
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-scrollthrottle
   */
  scrollThrottle: 0,

  /*
   |--------------------------------------------------------------------------
   | Notify (true|false)
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-notify
   */
  notify: true,

  /*
   |--------------------------------------------------------------------------
   | Host
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-host
   */
  // Override host detection if you know the correct IP to use
  //host: "192.168.1.102",

  /*
   |--------------------------------------------------------------------------
   | Excluded File Types
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-excludedfiletypes
   */
  excludedFileTypes: [],

  /*
   |--------------------------------------------------------------------------
   | Reload Delay
   |--------------------------------------------------------------------------
   | https://github.com/shakyShane/browser-sync/wiki/options#wiki-reloadDelay
   */
  reloadDelay: 1000

};