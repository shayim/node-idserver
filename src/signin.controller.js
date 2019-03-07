const debug = require('debug')('idserver:interaction')

module.exports = (provider) => async function (ctx, next) {
  debug('details', await provider.interactionDetails(ctx.req))

  await next()
}
