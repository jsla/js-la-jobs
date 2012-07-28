var fs = require('fs');
var markdown = require('markdown').markdown.toHTML;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/jsla_jobs');

var JobSchema = new Schema({
    company: String
  , website: String
  , logo: String
  , location: String
  , position: String
  , body: String
  , created_at: Date
})

JobSchema.pre('save', function(next) {
  this.created_at = this.created_at || new Date();
  next();
})

var Job = mongoose.model('Job', JobSchema)

module.exports = function(app) {
  
  app.get('/', function(req, res) {

    var fields = ['location', 'position', 'company', 'date']

    Job.find({}, fields, function(err, jobs) {
      if (err) {
        res.send(500)
      } else {
        res.render('index', { title: 'LA.js Job Board', jobs: jobs })
      }
    })
  });

  app.get('/jobs', function(req, res) {
    res.redirect('/');
  })

  app.get('/jobs/new', function(req, res) {
    res.render('job_new', {title: 'New Posting | LA.js Job Board'});
  });

  app.post('/jobs/create', function(req, res) {
    var job = new Job(req.body)
    job.save();
    res.send(200);
  });

  app.get('/jobs/:job_id', function(req, res) {
    var jobMd = fs.readFileSync('./tmp/job.md').toString();
    var jobHtml = markdown(jobMd);

    res.render('job', {
      title: 'Front-End Developer | LA.js Job Board',
      position: 'Front-End Developer',
      date: 'July 27, 2012',
      company: 'SecondMarket',
      url: 'http://www.secondmarket.com',
      location: 'Santa Monica',
      jobBody: jobHtml
    });  
  });



};