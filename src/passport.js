const passport = require('koa-passport')

const {
  AccountModel
} = require('./mongo-account')
const weixin = require('./wechat')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const account = await AccountModel.findById(id)
    done(null, account)
  } catch (error) {
    console.log(error)
    done(error)
  }
})

passport.use(weixin)

module.exports = passport
