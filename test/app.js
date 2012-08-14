require('./_helper')

var app = require('../app'),
    assert = require('chai').assert,
    request = require('request')

describe('App', function() {
  it('should be an express app', function() {
    assert.ok(app)
  })

  describe('GET /', function() {
    var body = null
    var response = null
    
    before(function(done) {
      var o = {
        uri: 'http://localhost:' + app.settings.port +'/'
      }
      request(o, function(err, _response, _body) {
        response = _response
        body = _body

        done()
      })
    })

    it('loads', function() {
      assert.ok(body, 'body should be ok')
      assert.equal(response.statusCode, 200, 'response code should be 200')
    })
  })

})