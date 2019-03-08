const debug = require('debug')('idserver:config')
const Account = require('./account')
module.exports = {
  findById: Account.findById,
  features: {
    devInteractions: true
  },
  cookies: {
    // names: {
    //   session: '_session',
    //   interaction: 'grant',
    //   resume: 'grant',
    //   state: '_state'
    // },
    // long: {
    //   secure: undefined,
    //   signed: true,
    //   httpOnly: true,
    //   maxAge: 1209600000
    // },
    // short: {
    //   secure: undefined,
    //   signed: true,
    //   httpOnly: true,
    //   maxAge: 600000
    // },
    keys: ['secret']
  },
  interactionUrl (ctx, interaction) {
    debug('%o', ctx, interaction)
    return `/signin/${ctx.oidc.uuid}`
  }
}
