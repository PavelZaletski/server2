var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  id:     String,
  title:  String,
  author: String,
  text:   String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('News', newsSchema);
