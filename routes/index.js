var fs = require('fs');
var markdown = require('markdown').markdown.toHTML;
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'LA.js Job Board' });
};

exports.job = function(req, res) {

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
  })
};