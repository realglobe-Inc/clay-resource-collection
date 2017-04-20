/**
 * Collection extensions for Clay-Resource
 * @module clay-resource-collection
 */

'use strict'

let d = (module) => module && module.default || module

module.exports = {
  get define () { return d(require('./define')) }
}
