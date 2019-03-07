const debug = require('debug')('idserver:MyAdapter')

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'DeviceCode',
  'RefreshToken',
  'Session'
])

let store

class MyAdpter {
  constructor (name) {
    this.name = name
  }

  upsert (id, payload, expiresIn) {
    debug(this.name, 'upsert', id, payload, store)

    let obj = store.get(this.name).get(id) || {}
    obj = Object.assign(obj, payload)

    Object.entries(obj).forEach(([key, value]) => {
      if (payload[key] === undefined) delete obj[key]
    })

    store.get(this.name).set(id, payload)

    debug(this.name, 'upsert check store', store)
    return Promise.resolve()
  }

  find (id) {
    debug(this.name, 'find', id, store)
    return Promise.resolve(store.get(this.name).get(id))
  }

  consume (id) {
    let obj = store.get(this.name).get(id)
    obj.consumed = Date.now()
    return Promise.resolve()
  }

  destroy (id) {
    let obj = store.get(this.name).get(id)
    let grantId = obj && obj.grantId

    grantable.forEach(grant => {
      store.get(grant).forEach((value, key) => {
        if (grantId === value.grantId) store.get(grant).delete(key)
      })
    })

    return Promise.resolve()
  }

  static connect () {
    store = new Map()
    grantable.forEach(grant => store.set(grant, new Map()))
  }
}

module.exports = MyAdpter
