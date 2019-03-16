// Auth request
// http://localhost:8000/auth?scope=openid%20profile&response_type=code&client_id=secret&redirect_uri=http://localhost:5757

// http://localhost:8000/auth?scope=openid%20profile&response_type=token%20id_token&client_id=implicit&redirect_uri=https://expat-ins.com&nonce=123456

// http://localhost:8000/auth?response_mode=form_post&scope=openid&response_type=id_token&client_id=implicit&redirect_uri=https://expat-ins.com&nonce=123456

module.exports = [{
  client_id: 'implicit',
  grant_types: ['implicit'],
  redirect_uris: ['https://expat-ins.com'],
  response_types: ['id_token', 'token id_token'],
  post_logout_redirect_uris: ['https://expat-ins.com'],
  token_endpoint_auth_method: 'none'
}, {
  client_id: 'secret',
  client_secret: 'secret',
  redirect_uris: ['http://localhost:5757']
}]
