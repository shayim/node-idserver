const debug = require('debug')('idserver:Account')

module.exports = class Account {
  static async findById (ctx, id) {
    debug('%o', ctx, id)

    return {
      accountId: id,
      async claims (use, scope) {
        debug('%o', use, scope)

        return {
          sub: id
        }
      }
    }
  }
}
