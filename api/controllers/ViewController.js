'use strict'

const Controller = require('trails-controller')

/**
 * @module ViewController
 * @description Generated Trails.js Controller.
 */
module.exports = class ViewController extends Controller{
  index (req, res){
    res.render('index')
  }
}

