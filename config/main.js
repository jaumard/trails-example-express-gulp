'use strict'

const path = require('path')
/**
 * Trailpack Configuration
 * (app.config.main)
 *
 * @see http://trailsjs.io/doc/config/main
 */
module.exports = {

  /**
   * Order does *not* matter. Each module is loaded according to its own
   * requirements.
   */
  packs: [
    require('trailpack-core'),
    require('trailpack-repl'),
    require('trailpack-router'),
    require('trailpack-gulp'),
    require('trailpack-express4')
  ],

  /**
   * Define application paths here. "root" is the only required path.
   */
  paths: {
    root: process.cwd(),
    temp: path.resolve(process.cwd(), '.tmp'),
    www: path.resolve(process.cwd(), '.tmp', 'public')
  }
}
