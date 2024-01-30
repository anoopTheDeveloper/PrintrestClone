const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
    trim: true,
  },

  title: {
    type:String
  },
  image : {
    type: String
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  postDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
