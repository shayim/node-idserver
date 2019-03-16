const debug = require('debug')('idserver:Account')
const uuid = require('uuid/v4')

let store = new Map()

module.exports = class Account {
  constructor (id, data) {
    this.id = id || uuid()

    store.set(this.id, data)
  }

  static async findById (ctx, id) {
    debug('%s %o', id, ctx.oidc)

    let account = store.get(id)

    return {
      accountId: id,
      async claims (use, scope) {
        debug('%s %s', use, scope)

        return {
          sub: id,
          ...(account ? account.data : undefined)
        }
      }
    }
  }

  static async findByLogin (login) {
    // check login
    debug('%o', login)

    var arr = Array.from(store)
    var account = arr.find(([key, value]) => {
      return login.email === value.email
    })
    return Promise.resolve(account)
  }
}
