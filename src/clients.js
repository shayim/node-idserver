// Auth request
// http://localhost:8000/auth?scope=openid%20profile&response_type=code&client_id=secret&redirect_uri=http://localhost:5757
// http://localhost:8000/auth?scope=openid%20profile&response_type=token%20id_token&client_id=implicit&redirect_uri=https://example.com&nonce=123456

module.exports = [{
  client_id: 'implicit',
  grant_types: ['implicit'],
  redirect_uris: ['https://example.com'],
  response_types: ['token id_token'],
  token_endpoint_auth_method: 'none'
}, {
  client_id: 'secret',
  client_secret: 'secret',
  redirect_uris: ['http://localhost:5757']
}]
