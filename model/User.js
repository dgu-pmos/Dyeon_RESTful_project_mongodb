var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new Schema({
    email: String,
    password: String,
    name: String,
    // 어떤 글에 '좋아요' 했는지 알기위해 참조한다.
    likes: [{ type: ObjectId, ref: 'Board' }],
    // 어떤 글에 댓글을 달았는지 알기위해 참조한다.
    comments: [{ type: ObjectId, ref: 'Board' }]
});

module.exports = mongoose.model('User', userSchema);