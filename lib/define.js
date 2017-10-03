/**
 * Define collection for resource
 * @function define
 * @param {ClayResource} - Resource to bind
 * @returns {function} Resource COllection class
 */
'use strict'

const {clone} = require('asobj')
const {Collection} = require('clay-collection')

const clayResourceName = require('clay-resource-name')

const demandWithRelativePage = (demand, pageSize) => {
  const page = clone(demand.page)
  const filter = clone(demand.filter)
  const sort = [].concat(demand.sort || []).filter(Boolean)
  page.number += pageSize
  return {page, filter, sort}
}

/** @lends define */
function define (resource) {
  const resourceName = clayResourceName(resource)

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
      const {offset} = s.meta
      return offset > 0
    }

    /**
     * Has next or not
     * @property {boolean} ResourceCollection#hasNext
     */
    get hasNext () {
      const s = this
      const {offset, length, total} = s.meta
      return offset + length < total
    }

    /**
     * Fetch next entities
     */
    async next () {
      const s = this
      const {demand = {}} = s
      return new ResourceCollection(
        await resource.list(demandWithRelativePage(demand, 1))
      )
    }

    /**
     * Fetch prev entities
     */
    async prev () {
      const s = this
      const {demand = {}} = s
      return new ResourceCollection(
        await resource.list(demandWithRelativePage(demand, -1))
      )
    }

  }

  return ResourceCollection
}

module.exports = define
