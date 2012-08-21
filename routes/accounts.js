var request = require('request')

var Job = require('../models/job')

module.exports = function(app, helpers) {

  app.get('/my/jobs', helpers.auth, function(req, res) {

    var conditions = {
        created_by: req.session.currentUser
    }

    var sort = 'created_at'

    var fields = {
        created_by: 1
      , location: 1
      , position: 1
      , company: 1
      , created_at: 1
      , activated_at: 1
    }

    var query = Job
      .find(conditions)
      .select(fields)
      .sort(sort,-1)

    query.exec(function(err, jobs) {
      if (err) {
        res.send(500)
      } else {
        var thirtyDaysAgo = helpers.getThirtyDaysAgo()
        var activeJobs = []
        var inactiveJobs = []

        var sortJob = function(job) {
          if (job.activated_at > thirtyDaysAgo) {
            activeJobs.push(job)
          } else {
            inactiveJobs.push(job)
          }
        }

        for (var i = 0; i < jobs.length; i++) { sortJob(jobs[i]) }

        res.render('accounts/jobs', {
            title: 'Manage Listings | ' + helpers.siteTitle
          , activeJobs: activeJobs
          , inactiveJobs: inactiveJobs
        })
      }
    })

  })

  app.post('/login', function(req, res) {
    var token = req.body.token

    var audience = 'http://' + req.headers.host

    var reqOpts = {
        url: 'https://browserid.org/verify'
      , method: 'POST'
      , json: {assertion: token, audience: audience}
    }

    var onResponse = function(err, resp, body) {
      if (body.email) {
        req.session.currentUser = body.email
        res.send(req.session.desiredUrl || '/')
      } else {
        res.send(500)
      }
    }

    request(reqOpts, onResponse)
  })

}
