const debug = require('debug')('idserver:interaction')
const bodyParser = require('koa-body')()
const Router = require('koa-router')

const Account = require('./account')

module.exports = function (provider) {
  const router = new Router()

  router.get('/signin/:grant', async (ctx, next) => {
    const details = await provider.interactionDetails(ctx.req)
    const client = await provider.Client.find(details.params.client_id)

    debug('%o', 'get details')
    debug('%o', details)

    debug('%o', 'client')
    debug('%o', client)

    if (details.interaction.error === 'login_required') {
      await ctx.render('signin', {
        details
      })
    }

    await next()
  })

  router.post('/signin/:grant', bodyParser, async (ctx, next) => {
    debug('%o', 'post')
    debug('%o', ctx.request.body)

    const account = await Account.findByLogin(ctx.request.body.email)

    debug('%o', account)

    const result = {
      login: {
        account: account.id,
        remember: !!ctx.request.body.remember,
        ts: Math.floor(Date.now() / 1000)
      },
      consent: {}
    }

    await provider.interactionFinished(ctx.req, ctx.res, result)
    await next()
  })

  return router
}
