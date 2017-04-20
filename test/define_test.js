/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const { fromDriver } = require('clay-resource')
const clayDriverMemory = require('clay-driver-memory')
const { equal, ok } = require('assert')

const co = require('co')

describe('define', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let driver = clayDriverMemory({})
    let Org = fromDriver(driver, 'Org')
    let User = fromDriver(driver, 'User')

    Org.refs(User)
    User.refs(Org)

    let UserCollection = define(User)
    let OrgCollection = define(Org)

    let orgs = []
    let users = []
    for (let i = 0; i < 100; i++) {
      if (i < 50) {
        orgs.push(
          yield Org.create({ name: `org-${i}` })
        )
      }
      users.push(
        yield User.create({ name: `org-${i}`, org: orgs[ parseInt(i % 10) ] })
      )
    }

    {

      let userCollection01 = new UserCollection(
        yield User.list({ filter: { org: orgs[ 1 ] }, page: { size: 2, number: 1 } })
      )
      ok(userCollection01.hasNext)
      ok(!userCollection01.hasPrev)

      ok(yield userCollection01.next())
      ok(yield userCollection01.prev())
    }
  }))
})

/* global describe, before, after, it */
