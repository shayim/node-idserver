const debug = require('debug')('idserver:Account')
const uuid = require('uuid/v4')

module.exports = class Account {
  constructor (id) {
    this.id = id || uuid()
  }

  static async findById (ctx, id) {
    debug('%o', id)
    debug('%o', ctx)

    return {
      accountId: id,
      async claims (use, scope) {
        debug('%o', use)
        debug('%o', scope)

        return {
          sub: id
        }
      }
    }
  }

  static async findByLogin (login) {
    // check login
    debug('%o', login)
    return Promise.resolve(new Account())
  }
}
