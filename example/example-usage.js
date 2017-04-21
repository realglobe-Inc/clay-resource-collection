'use strict'

const { define } = require('clay-resource-collection')
const { fromDriver } = require('clay-resource')
const clayDriverMemory = require('clay-driver-memory')

async function tryExample () {
  let driver = clayDriverMemory({})
  let Org = fromDriver(driver, 'Org')
  let User = fromDriver(driver, 'User')

  let OrgCollection = define(User)
  let UserCollection = define(Org)

  let orgs = new OrgCollection(await Org.list({ filter: {} })
  let users = new UserCollection(await User.list({ filter: {} }))

  while (orgs.hasNext) {
    orgs = await orgs.next()
  }

}

tryExample.catch((err) => console.error)
