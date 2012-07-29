var fs = require('fs');
var markdown = require('markdown').markdown.toHTML;

var Job = require('../models/job')

module.exports = function(app) {
  
  app.get('/jobs', function(req, res) {

    var fields = ['location', 'position', 'company', 'created_at']

    Job.find({}, fields, function(err, jobs) {
      if (err) {
        res.send(500)
      } else {
        res.render('index', { title: 'LA.js Job Board', jobs: jobs })
      }
    })
  });

  app.get('/jobs/new', function(req, res) {
    res.render('job_new', {title: 'New Posting | LA.js Job Board'});
  });

  app.post('/jobs/create', function(req, res) {
    var job = new Job(req.body)
    job.created_at = new Date()
    job.save()
    res.redirect('/')
  });

  app.get('/jobs/:id', function(req, res) {

    Job.findById(req.params.id, function(err, job) {

      if (err) {
        res.send(404)
      } else if (job) {
        var body = markdown(job.body)

        res.render('job', {
            title: 'Front-End Developer | LA.js Job Board'
          , job: job
          , body: body
        });  
      }

    })

  });



};