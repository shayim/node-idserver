const debug = require('debug')('idserver:weixin')
const Account = require('./account')
const WechatStrategy = require('passport-wechat')

module.exports = new WechatStrategy({
  appID: process.env.LOGIN_AUTH_weixin_clientID,
  appSecret: process.env.LOGIN_AUTH_weixin_clientSecret,
  scope: 'snsapi_login',
  client: 'web'
}, async function (at, rt, pf, exp, done) {
  const account = {
    provider: 'wechat',
    providerId: pf.unionid || pf.openid,
    providerData: {
      at,
      rt
    }
  }
  const userInfo = {
    name: pf.nickname,
    pictures: [{
      source: 'webchat',
      url: pf.headimgurl
    }],
    gender: pf.sex === 1 ? 'male' : 'female',
    locale: pf.language.replace('_', '-'),
    addresses: [{
      kind: 'webchat',
      city: pf.city,
      state: pf.province,
      country: pf.country
    }]
  }

  debug('%o %o', account, userInfo)
  done(null, new Account(pf.unionid || pf.openid, {
    name: pf.nickname
  }))
})
