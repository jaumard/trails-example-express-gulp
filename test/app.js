const _ = require('lodash')
const smokesignals = require('smokesignals')

const Api = require('../api')
const Config = require('../config')

const App = {
  pkg: {
    name: 'trails-example-test',
    version: '1.0.0'
  },
  api: Api,
  config: Config
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
