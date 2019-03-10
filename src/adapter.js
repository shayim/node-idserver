const debug = require('debug')('idserver:MyAdapter')

const models = new Set([
  'AccessToken',
  'AuthorizationCode',
  'DeviceCode',
  'RefreshToken',
  'Session',
  'ClientCredentials',
  'Client',
  'InitialAccessToken',
  'RegistrationAccessToken'
])

let store

class MyAdpter {
  constructor (name) {
    this.name = name

    debug('%o', 'constructor', this.name)
  }

  upsert (id, payload, expiresIn) {
    store.get(this.name).set(id, payload)

    debug('%o', this.name, 'upsert', id)
    debug('%o', store.get(this.name).get(id))

    if (payload.grantId) {
      if (store.get(payload.grantId)) {
        store.get(payload.grantId).push(payload.grantId, `${this.name}:id`)

        debug('%o', 'upsert grantId', store.get(payload.grantId))
      } else {
        store.set(payload.grantId, [`${this.name}:${id}`])

        debug('%o', 'upsert grantId', store.get(payload.grantId))
      }
    }

    return Promise.resolve()
  }

  find (id) {
    if (this.name === 'Client') {
      debug('%o', 'not support client registration yet')
      return Promise.resolve()
    }
    const obj = store.get(this.name).get(id)

    debug('%o', this.name, 'find', id)
    debug('%o', obj)

    return Promise.resolve(obj)
  }

  consume (id) {
    let obj = store.get(this.name).get(id)
    const now = Date.now()
    obj.consumed = now

    debug('%o', this.name, 'consume', id, now)
    debug('%o', this.name, 'consume', obj)
    return Promise.resolve()
  }

  destroy (id) {
    let obj = store.get(this.name).get(id)

    debug('%o', this.name, 'destroy', id)
    debug('%o', obj)

    if (obj) store.get(this.name).delete(id)

    if (obj && obj.grantId) {
      store.get(obj.grantId).forEach((value) => {
        const [name, id] = value.split(':')

        debug('%o', 'destroy by grandId', obj.grantId, store.get(name).get(id))
        debug('%o', store.get(name).get(id))

        store.get(name).delete(id)
      })
    }

    return Promise.resolve()
  }

  static connect () {
    store = new Map()
    models.forEach(grant => store.set(grant, new Map()))
  }
}

module.exports = MyAdpter
