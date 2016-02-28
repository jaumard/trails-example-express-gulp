'use strict'

const Controller = require('trails-controller')

/**
 * @module DefaultController
 * @description Generated Trails.js Controller.
 */
module.exports = class DefaultController extends Controller{
  infos (req, res) {
    res.send(this.app.services.DefaultServices.getApplicationInfo())
  }
}

