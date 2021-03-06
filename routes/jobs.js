var fs = require('fs');
var markdown = require('markdown').markdown.toHTML;

var stripeApiKey = 'nkYIwfJ2XLrFWMPZRzgkrldX4qXE5bEV'
var stripe = require('stripe')(stripeApiKey)

var Job = require('../models/job')

module.exports = function(app, helpers) {

  app.get('/jobs', function(req, res) {
    var thirtyDaysAgo = helpers.getThirtyDaysAgo()

    var conditions = {
        activated_at: {$gte: thirtyDaysAgo}
    }

    var sort = 'created_at'

    var query = Job
      .find(conditions)
      .sort(sort,-1)

    query.exec(function(err, jobs) {
      if (err) {
        res.send(500)
      } else {
        res.render('jobs/index', {
            title: helpers.siteTitle
          , jobs: jobs
          , currentUser: req.session.currentUser
        })
      }
    })

  })

  app.get('/jobs/new', helpers.auth, function(req, res) {
    var job = req.flash('job')[0] || {}
    var errors = req.flash('errors')[0] || {}

    res.render('jobs/new', {
        title: 'New Listing | ' + helpers.siteTitle
      , job: job
      , errors: errors
    })
  })

  app.post('/jobs/create', helpers.auth, function(req, res) {
    var job = new Job(req.body)
    job.created_at = new Date()
    job.created_by = req.session.currentUser
    job.save(function(err) {
      if (err) {
        req.flash('job', job)
        req.flash('errors', err.errors)
        res.redirect('/jobs/new')
      } else {
        res.redirect('/my/jobs')
      }
    })
  })

  app.post('/jobs/edit/:id', function(req, res) {
    var conditions = {
        created_by: req.session.currentUser
      , _id: req.params.id
    }

    var update = req.body

    Job.update(conditions, update, function(err, nAffected) {
      if (err) {
        res.send(500)
      } else {
        res.redirect('/my/jobs')
      }
    })
  })

  app.get('/jobs/edit/:id', function(req, res) {
    var conditions = {
        created_by: req.session.currentUser
      , _id: req.params.id
    }

    var errors = req.flash('errors')[0] || {}

    Job.find(conditions, function(err, docs) {
      var job = docs[0]
      if (job) {
        res.render('jobs/edit', {
            title: 'Edit Listing | ' + helpers.siteTitle
          , job: job
          , errors: errors
        })
      } else {
        res.send(404)
      }
    })

  })

  app.get('/jobs/activate/:id', helpers.auth, function(req, res) {
    var conditions = {
        created_by: req.session.currentUser
      , _id: req.params.id
    }

    var errors = req.flash('errors')[0] || {}

    Job.findOne(conditions, function(err, job) {
      if (err) {
        console.log(err)
        res.send(500)
      } else if (!job) {
        res.send(404)
      } else {
        res.render('jobs/activate', {
            title: 'Activate Posting | ' + helpers.siteTitle
          , job: job
          , errors: errors // I'm guessing we will implement these?
        })
      }
    })
  })

  app.post('/jobs/activate/:id', function(req, res) {
    var stripeToken = req.body.stripeToken

    var conditions = {
        created_by: req.session.currentUser
      , _id: req.params.id
      , activated_at: {$exists: false}
    }

    var update = {
        activated_at: new Date
    }

    var chargeOpts = {
        amount: 30000
      , currency: 'usd'
      , card: stripeToken
      , description: req.session.currentUser
    }

    var chargeCallback = function(err, response) {
      if (err) {
        console.log(err)
        res.send(500)
      } else {
        console.log('response', response)

        Job.update(conditions, update, function(err, nAffected) {
          if (err) {
            console.log(err)
            res.send(500)
          } else {
            res.redirect('/my/jobs')
          }
        })
      }
    }

    var charge = stripe.charges.create(chargeOpts, chargeCallback)

  })

  app.get('/jobs/:id', function(req, res) {

    Job.findById(req.params.id, function(err, job) {

      if (err) {
        res.send(404)
      } else if (job) {
        var body = markdown(job.body)
          , email = {
              subject: job.company + ' is hiring a ' + job.position
            , body: job.company + ' is hiring a ' + job.position + ' at http://jobs.js.la/jobs/' + job._id
            }

        res.render('jobs/show', {
            title: job.position + ' | ' + helpers.siteTitle
          , job: job
          , body: body
          , emailLink: 'mailto:?body=' + escape(email.body) + '&subject=' + escape(email.subject)
        })
      }
    })

  })

}
