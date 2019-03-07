module.exports = [{
  client_id: 'client1',
  grant_types: ['implicit'],
  redirect_uris: ['https://example.com'],
  response_types: ['token id_token'],
  token_endpoint_auth_method: 'none'
}, {
  client_id: 'client2',
  client_secret: 'secret',
  redirect_uris: ['https://example.com']
}]
