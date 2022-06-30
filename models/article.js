const mongoose = require('mongoose');

// Article Schema
const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});
let Article = module.exports= mongoose.model('Article', articleSchema);
// const Article = mongoose.model('Article', articleSchema);
// module.exports.Article = Article;
