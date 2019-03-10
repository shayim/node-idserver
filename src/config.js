const debug = require('debug')('idserver:config')
const Account = require('./account')
const supportedClaims = require('./supported-claims')
module.exports = {
  discovery: {
    claim_types_supported: ['normal', 'aggregated', 'distributed']
  },
  findById: Account.findById,
  claims: supportedClaims,
  features: {
    devInteractions: false,
    sessionManagement: true
  },
  cookies: {
    keys: ['secret']
  },
  interactionUrl (ctx, interaction) {
    debug('%o', 'interactionUrl')
    debug('%o', ctx)
    debug('%o', interaction)
    return `/signin/${ctx.oidc.uuid}`
  }
}
