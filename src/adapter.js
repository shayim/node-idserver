const debug = require('debug')('idserver:MyAdapter')

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'DeviceCode',
  'RefreshToken',
  'Session',
])

let store

class MyAdpter {
  constructor(name) {
    this.name = name

    debug('%o', 'constructor', this.name)
  }

  upsert(id, payload, expiresIn) {
    let obj = store.get(this.name).get(id) || {}
    obj = Object.assign(obj, payload)

    Object.entries(obj).forEach(([key, value]) => {
      if (payload[key] === undefined) delete obj[key]
    })

    store.get(this.name).set(id, obj)

    debug('%o', this.name, 'upsert', id)
    debug('%o', store.get(this.name).get(id))

    return Promise.resolve()
  }

  find(id) {
    const obj = store.get(this.name).get(id)

    debug('%o', this.name, 'find', id)
    debug('%o', this.name, 'find', obj)

    return Promise.resolve(obj)
  }

  consume(id) {
    let obj = store.get(this.name).get(id)
    const now = Date.now()
    obj.consumed = now

    debug('%o', this.name, 'consume', id, now)
    debug('%o', this.name, 'consume', obj)
    return Promise.resolve()
  }

  destroy(id) {
    let obj = store.get(this.name).get(id)

    debug('%o', this.name, 'destroy', id)
    debug('%o', this.name, 'destroy', obj)

    if (obj) store.get(this.name).delete(id)

    if (obj && obj.grantId) {
      grantable.forEach(grant => {
        store.get(grant).forEach((value, key) => {
          if (obj.grantId === value.grantId) {
            store.get(grant).delete(key)

            debug('%o', this.name, 'destroy by same grandId', obj.grantId, key)
            debug('%o', this.name, 'destroy by same grandId', value)
          }
        })
      })
    }

    return Promise.resolve()
  }

  static connect() {
    store = new Map()
    grantable.forEach(grant => store.set(grant, new Map()))
  }
}

module.exports = MyAdpter
