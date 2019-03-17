const mongoose = require('mongoose')

function emailValidate (emailAddress) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailAddress)
}

const userInfoSchema = new mongoose.Schema({
  profile: {
    names: {
      name: String,
      given: String,
      family: String,
      middle: String,
      nicknames: [String],
      usernames: [String]
    },
    gender: {
      type: String,
      enum: ['female', 'male'],
      default: 'female'
    },
    birthdate: Date,
    profiles: [String],
    pictures: [{
      _id: false,
      source: String,
      url: String
    }],
    websites: [String],
    zoneinfo: String,
    locale: String,
    updatedAt: Number
  },
  emails: [{
    _id: false,
    email: {
      type: String,
      trim: true,
      validate: emailValidate
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  phones: [{
    _id: false,
    kind: String,
    phone: {
      type: String,
      require: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  addresses: [{
    _id: false,
    kind: String,
    street: String,
    city: String,
    region: String,
    country: String,
    postcode: String
  }],
  socialMedia: [{
    _id: false,
    kind: String,
    handle: String
  }]
}, {
  _id: false
})

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function () {
      return !this.providerId
    },
    trim: true,
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
  email_verified: {
    type: Boolean,
    default: false
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
  providerId: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        providerId: {
          $type: 'string'
        }
      }
    }
  },
  providerData: {},
  userInfo: userInfoSchema,
  lastVisit: {
    type: Date,
    default: Date.now()
  }
})

const AccountModel = module.exports.AccountModel = mongoose.model('Account', accountSchema)

module.exports.Account = class Account {
  static async findById (ctx, sub) {
    const account = await AccountModel.findById(sub)
    return {
      accountId: account.id,

      async claims (use, scope) {
        const scopes = scope.split(/\s+/)
        let userInfo = {}

        if (use === 'userinfo' && scopes.length > 1 && account.userInfo) {
          userInfo = account.userInfo

          Object.keys(userInfo).forEach(key => {
            if (!scopes.includes(key)) {
              delete userInfo[key]
            } else {
              // flatten  useInfo
              // delete userInfo[key]
            }
          })
        }
        return {
          sub: account.id,
          ...(userInfo.profile && userInfo.profile.names ? userInfo.profile.names : undefined),
          ...(userInfo.gender ? {
            gender: userInfo.gender
          } : undefined)
        }
      }
    }
  }

  static async findByLogin (email) {
    return AccountModel.findOne({
      email: email
    })
  }
}
