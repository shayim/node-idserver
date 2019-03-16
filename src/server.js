const path = require('path')
const Koa = require('koa')
const render = require('koa-ejs')
const mount = require('koa-mount')
const Provider = require('oidc-provider')

// const debug = require('debug')('idserver:error')

const HOST = 'localhost'
const PORT = process.env.PORT || 8000

const config = require('./config')
const oidc = new Provider(`http://${HOST}:${PORT}`, config)

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/oidc-id-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
  promiseLibrary: global.Promise
}).then(m => console.log('mongodb connected'))

let server
const app = new Koa()
app.keys = config.cookies.keys

;
(async () => {
  await oidc.initialize({
    adapter: require('./adapter'),
    clients: require('./clients'),
    keystore: require('./sign-key.json')
  })

  oidc.on('server_error', (err, ctx) => {
    throw err
  })
  oidc.on('grant.error', (err, ctx) => console(err, ctx))

  // let adapterTester = new oidc.constructor.AdapterTest(oidc)
  // await adapterTester.execute()

  const passport = require('./passport')
  app.use(passport.initialize())

  render(app, {
    root: path.join(__dirname, 'view'),
    viewExt: 'html',
    cache: false
  })

  const interaction = require('./interaction')
  app.use(interaction(oidc).routes())
  app.use(mount(oidc.app))

  server = app.listen(PORT, HOST, () => {
    console.log('%o', `id server listening at ${PORT}`)
  })
})().catch(error => {
  if (server && server.listening) server.close()

  console.log(error)
  process.exitCode = 1
})
