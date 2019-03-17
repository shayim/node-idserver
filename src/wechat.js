const debug = require('debug')('idserver:weixin')
const {
  AccountModel
} = require('./mongo-account')
const WechatStrategy = require('passport-wechat')

module.exports = new WechatStrategy({
  appID: process.env.LOGIN_AUTH_weixin_clientID,
  appSecret: process.env.LOGIN_AUTH_weixin_clientSecret,
  scope: 'snsapi_login',
  client: 'web'
}, async function (at, rt, pf, exp, done) {
  console.log(pf)

  const account = {
    provider: 'wechat',
    providerId: pf.unionid || pf.openid,
    providerData: {
      at,
      rt,
      exp
    },
    userInfo: {
      profile: {
        names: {
          nicknames: [pf.nickname]
        },

        gender: pf.sex === 1 ? 'male' : 'female',

        pictures: [{
          source: 'webchat',
          url: pf.headimgurl
        }],

        locale: pf.language.replace('_', '-')
      },

      addresses: [{
        kind: 'webchat',
        city: pf.city,
        state: pf.province,
        country: pf.country
      }]
    }
  }

  let newAccount = await AccountModel.findOneAndUpdate({
    provider: 'wechat',
    providerId: pf.unionid || pf.openid
  }, account, {
    upsert: true,
    new: true
  })

  debug('%o', newAccount)
  done(null, newAccount)
})
