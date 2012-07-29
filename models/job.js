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

var Job = mongoose.model('Job', JobSchema)

module.exports = Job