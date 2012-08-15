require('./_helper')

var app = require('../app'),
    // assert = require('chai').assert,
    assert = require('assert'),
    Job = require('../models/job'),
    JobFactory = require('./job_factory')


var jobTestHelper = {
  dropDB: function(cb) {
    Job.collection.drop(cb)
  }
}

describe('Jobs', function() {
  
  describe('validation', function() {

    before(function(done) {
      jobTestHelper.dropDB(function() {
        var jobData = new JobFactory()
        delete jobData.position
        var job = new Job(jobData)
        job.save(function(err) {
          done()
        })

      })
      
    })

    it('should not save without position', function(done) {

      Job.find({}, function(err, jobs) {
        assert.equal(jobs.length, 0, 'jobs.length should be 0')
        done()
      })

    })
  })  

})