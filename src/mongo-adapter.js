const mongoose = require('mongoose')
const debug = require('debug')('idserver:MongoAdapter')

const grantSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: [
      'AccessToken',
      'AuthorizationCode',
      'DeviceCode',
      'RefreshToken',
      'Session',
      'ClientCredentials',
      'Client',
      'InitialAccessToken',
      'RegistrationAccessToken'
    ],
    required: true
  },
  kindId: {
    type: String,
    required: true,
    index: true
  },
  grantId: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        grantId: {
          $type: 'string'
        }
      }
    }
  },
  payload: {},
  expiresIn: {
    type: Date
  }
})

grantSchema.index({
  expiresIn: 1
}, {
  expireAfterSeconds: 0,
  background: true
})

const GrantModel = module.exports.GrantModel = mongoose.model('Grant', grantSchema)

module.exports.MongoAdatper = class {
  constructor (name) {
    this.name = name
  }

  async upsert (id, payload, expiresIn) {
    // debug('%s %j %s', `${this.name} upsert`, id, JSON.stringify(payload), expiresIn)
    if (payload.grantId) debug('%s', `upsert ${this.name} with grantId ${payload.grantId} with id ${id}`)
    else debug('%s', `upsert ${this.name} without grantId with id ${id}`)

    await GrantModel.findOneAndUpdate({
      kind: this.name,
      kindId: id
    }, {
      kind: this.name,
      kindId: id,
      grantId: payload.grantId ? payload.grantId : undefined,
      $set: {
        payload: payload,
        expiresIn: new Date(Date.now() + (expiresIn * 1000))
      }

    }, {
      upsert: true
    })
  }

  async find (id) {
    debug('%s', `find ${this.name}`, id)

    let grant = await GrantModel.findOne({
      kind: this.name,
      kindId: id
    })

    return grant.payload
  }

  async consume (id) {
    debug('%s', `consume ${this.name}`, id)

    await GrantModel.findOneAndUpdate({
      kind: this.name,
      kindId: id
    }, {
      $set: {
        'payload.consumed': Date.now()
      }
    })
  }

  async destroy (id) {
    debug('%s', `destroy ${this.name}`, id)

    const grant = await GrantModel.findOneAndDelete({
      kind: this.name,
      kindId: id
    })

    if (grant & grant.grantId) {
      await GrantModel.deleteMany({
        grantId: grant.grantId
      })
    }
  }
}

/*
https: //expat-ins.com/#error=consent_required&error_description=requested%20scopes%20not%20granted%20by%20End-User&state=SdrOIW4KdeG20KiBhocVOFDt7Qd0BMUuOMUn6nzD&session_state=ccf80f6493022c198881f278bf1aec6a860e56142e70eb9096b7d7f9c6ed1e8f.ec925d875c0c3db9
*/
