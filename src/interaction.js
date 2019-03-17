const debug = require('debug')('idserver:interaction')
const passport = require('koa-passport')
const bodyParser = require('koa-body')()
const Router = require('koa-router')
const bcrypt = require('bcrypt')
const {
  Account,
  AccountModel
} = require('./mongo-account')

module.exports = function (provider) {
  const router = new Router()

  const {
    constructor: {
      errors: {
        AccessDenied
      }
    }
  } = provider

  router.get('/signin/:grant/newaccount', async (ctx, next) => {
    const details = await provider.interactionDetails(ctx.req)
    await ctx.render('newaccount', {
      details
    })
    await next()
  })

  router.post('/signin/:grant/newaccount', bodyParser, async (ctx, next) => {
    let {
      email,
      password
    } = ctx.request.body
    if (!email || !password) throw new Error('no email or password found')
    let hash = await bcrypt.hash(password, 10)
    let account = new AccountModel({
      email,
      password: hash,
      provider: 'local'
    })

    account = await account.save()

    console.log(account.id)

    const result = {
      login: {
        account: account.id,
        remember: true,
        ts: Math.floor(Date.now() / 1000)
      },
      consent: {}
    }

    await provider.interactionFinished(ctx.req, ctx.res, result)
    await next()
  })

  router.get('/signin/:grant/wechat', async (ctx, next) => {
    const url = ctx.URL + '/callback'

    passport.authenticate('wechat', {
      callbackURL: url
    })(ctx, next)
  })

  router.get('/signin/:grant/wechat/callback', passport.authenticate('wechat'), async (ctx, next) => {
    const accountId = ctx.state.user.id

    const result = {
      login: {
        account: accountId,
        remember: true,
        ts: Math.floor(Date.now() / 1000)
      },
      consent: {}
    }

    await provider.interactionFinished(ctx.req, ctx.res, result)
    await next()
  })

  router.get('/signin/:grant', async (ctx, next) => {
    const details = await provider.interactionDetails(ctx.req)

    const client = await provider.Client.find(details.params.client_id)

    // debug('%s %o %o', 'get', details, client)

    if (details.interaction.error === 'login_required') {
      await ctx.render('signin', {
        details
      })
    }

    await next()
  })

  router.post('/signin/:grant', bodyParser, async (ctx, next) => {
    try {
      const account = await Account.findByLogin(ctx.request.body.email)

      let success
      if (account) {
        success = await bcrypt.compare(ctx.request.body.password, account.password)
      }
      if (!success) throw new AccessDenied()

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
    } catch (error) {
      throw error
    }
  })

  return router
}
