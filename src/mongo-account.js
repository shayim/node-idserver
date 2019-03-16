const mongoose = require('mongoose')

function emailValidate (emailAddress) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailAddress)
}

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function () {
      return !this.providerId
    },
    trim: true,
    minlength: 3,
    validate: emailValidate,
    index: {
      unique: true,
      partialFilterExpression: {
        email: {
          $type: 'string'
        }
      }
    }
  },
  password: {
    type: String,
    required: function () {
      return !this.providerId
    }
  },
  provider: {
    type: String,
    required: true
  },
  providerId: String,
  providerData: {},
  userInfo: Map,
  lastVisit: {
    type: Date,
    default: Date.now()
  }
})

const MongoAccount = mongoose.model('Account', accountSchema)

module.exports = MongoAccount
