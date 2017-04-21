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
        yield User.list({ filter: { org: orgs[ 1 ] }, page: { size: 5, number: 1 } })
      )
      ok(userCollection01.hasNext)
      ok(!userCollection01.hasPrev)

      let userCollection02 = yield userCollection01.next()

      ok(userCollection02.hasPrev)

      let userCollection03 = yield userCollection02.prev()
      ok(!userCollection03.hasPrev)

      let userCollection04 = yield userCollection02.next()
      ok(userCollection04.hasPrev)
      ok(!userCollection04.hasNext)
    }
  }))
})

/* global describe, before, after, it */
