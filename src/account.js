const debug = require('debug')('idserver:Account')

module.exports = class Account {
  static async findById(ctx, id) {
    debug('%o', id)
    debug('%o', ctx)

    return {
      accountId: id,
      async claims(use, scope) {
        debug('%o', use)
        debug('%o', scope)

        return {
          sub: id,
        }
      },
    }
  }
}
