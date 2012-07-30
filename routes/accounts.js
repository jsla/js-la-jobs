var request = require('request')

module.exports = function(app) {

  app.get('/login', function(req, res) {
    res.render('accounts/login', {title: 'Account Login | LA.js Job Board'})
  })

  app.post('/login', function(req, res) {
    var token = req.body.token
    var audience = 'http://localhost:3000'
    
    var reqOpts = {
        url: 'https://browserid.org/verify'
      , method: 'POST'
      , json: {assertion: token, audience: audience}
    }

    var onResponse = function(err, resp, body) {
      if (body.email) {
        req.session.currentUser = body.email
        res.send(body)
      } else {
        res.send(500)
      }
    }

    request(reqOpts, onResponse)
  })

}