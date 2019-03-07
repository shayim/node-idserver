const Provider = require('oidc-provider')
const Koa = require('koa')
const mount = require('koa-mount')
const debug = require('debug')('idserver:error')

const HOST = 'localhost'
const PORT = process.env.PORT || 8000

let server
const app = new Koa()

const config = require('./config')
const oidc = new Provider(`http://${HOST}:${PORT}`, config)

;
(async () => {
  await oidc.initialize({
    adapter: require('./adapter'),
    clients: require('./clients'),
    keystore: require('./sign-key.json')
  })

  oidc.on('grant.error', (err, ctx) => debug(err, ctx))

  // let adapterTester = new oidc.constructor.AdapterTest(oidc)
  // await adapterTester.execute()

  const signCtrl = require('./signin.controller')
  app.use(mount('/signin', signCtrl(oidc)))

  app.use(mount(oidc.app))

  server = app.listen(PORT, HOST, () => console.log(`id server listening at ${PORT}`))
})().catch(error => {
  if (server && server.listening) server.close()

  debug(error)
  process.exitCode = 1
})
