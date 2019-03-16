const debug = require('debug')('idserver:config')
const Account = require('./account')
const supportedClaims = require('./supported-claims')
module.exports = {
  discovery: {
    claim_types_supported: ['normal', 'aggregated', 'distributed']
  },
  findById: Account.findById,
  claims: supportedClaims,
  cookies: {
    keys: ['secret']
  },
  interactionUrl (ctx, interaction) {
    debug('%s %o %o', 'interactionUrl', ctx.oidc, interaction)
    return `/signin/${ctx.oidc.uuid}`
  },
  features: {
    // frontchannelLogout: true,
    backchannelLogout: true,
    devInteractions: false,
    sessionManagement: true
  }
}
