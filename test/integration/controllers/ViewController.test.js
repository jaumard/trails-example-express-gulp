'use strict'
/* global describe, it */

const assert = require('assert')

describe('ViewController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers['ViewController'])
  })
})
