module.exports = function(app) {

  app.get('/login', function(req, res) {
    res.render('accounts/login', {title: 'Account Login | LA.js Job Board'})
  })

}