var fs = require('fs');
var markdown = require('markdown').markdown.toHTML;

var Job = require('../models/job')

module.exports = function(app, helpers) {
  
  app.get('/jobs', function(req, res) {
    var thirtyDaysAgo = helpers.getThirtyDaysAgo()

    var conditions = {
        activated_at: {$gte: thirtyDaysAgo}
    }

    console.log(conditions)

    var sort = 'created_at'

    var query = Job
      .find(conditions)
      .sort(sort,-1)

    console.log(query)

    query.exec(function(err, jobs) {
      if (err) {
        res.send(500)
      } else {
        res.render('jobs/index', { title: 'LA.js Job Board', jobs: jobs, currentUser: req.session.currentUser })
      }
    })

  });

  app.get('/jobs/new', helpers.auth, function(req, res) {
    res.render('jobs/new', {title: 'New Posting | LA.js Job Board'});
  });

  app.post('/jobs/create', helpers.auth, function(req, res) {
    var job = new Job(req.body)
    job.created_at = new Date()
    job.created_by = req.session.currentUser
    job.save()
    res.redirect('/')
  });

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

    Job.find(conditions, function(err, docs) {
      var job = docs[0]
      if (job) {
        res.render('jobs/edit', {
            title: 'Edit Job'
          , job: job
        })
      } else {
        res.send(404)
      }
    })

  })
  
  app.get('/jobs/:id', function(req, res) {

    Job.findById(req.params.id, function(err, job) {

      if (err) {
        res.send(404)
      } else if (job) {
        var body = markdown(job.body)

        res.render('jobs/show', {
            title: 'Front-End Developer | LA.js Job Board'
          , job: job
          , body: body
        });  
      }

    })

  });



};