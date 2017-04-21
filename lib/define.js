/**
 * Define collection for resource
 * @function define
 * @param {ClayResource} - Resource to bind
 * @returns {function} Resource COllection class
 */
'use strict'

const co = require('co')
const { clone } = require('asobj')
const { Collection } = require('clay-collection')

const clayResourceName = require('clay-resource-name')

const demandWithRelativePage = (demand, pageSize) => {
  let page = clone(demand.page)
  let filter = clone(demand.filter)
  let sort = [].concat(demand.sort || []).filter(Boolean)
  page.number += pageSize
  return { page, filter, sort }
}

/** @lends define */
function define (resource) {
  let resourceName = clayResourceName(resource)

  /** @class ResourceCollection */
  class ResourceCollection extends Collection {
    static get resourceName () {
      return resourceName
    }

    /**
     * Has prev or not
     * @property {boolean} ResourceCollection#hasPrev
     */
    get hasPrev () {
      const s = this
      let { offset } = s.meta
      return offset > 0
    }

    /**
     * Has next or not
     * @property {boolean} ResourceCollection#hasNext
     */
    get hasNext () {
      const s = this
      let { offset, length, total } = s.meta
      return offset + length < total
    }

    /**
     * Fetch next entities
     */
    next () {
      const s = this
      let { demand = {} } = s
      return co(function * () {
        return new ResourceCollection(
          yield resource.list(demandWithRelativePage(demand, 1))
        )
      })
    }

    /**
     * Fetch prev entities
     */
    prev () {
      const s = this
      let { demand = {} } = s
      return co(function * () {
        return new ResourceCollection(
          yield resource.list(demandWithRelativePage(demand, -1))
        )
      })
    }

  }

  return ResourceCollection
}

module.exports = define
