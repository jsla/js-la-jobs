require('./_helper')

var app = require('../app'),
    assert = require('chai').assert,
    request = require('request')

var baseUrl = 'http://localhost:' + app.settings.port +'/'

describe('App', function() {
  it('should be an express app', function() {
    assert.ok(app)
  })

  describe('GET /', function() {
    var body = null
    var response = null
    
    before(function(done) {
      var o = {
        uri: baseUrl
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

  describe('GET /my/jobs', function() {
    var body = null
    var response = null

    before(function(done) {
      var o = {
          uri: baseUrl + 'my/jobs'
        , followRedirect: false
      }
      request(o, function(err, _response, _body) {
        response = _response
        body = _body
        done()
      })
    })

    it('should not load my jobs when not logged in', function() {
      assert(response.statusCode === 302)
    })
  })

})