var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// comment 스키마를 정의한다.
var CommentSchema = new Schema({
    // 댓글 작성자의 정보를 보여주기 위해 참조한다.
    user_id: { type: ObjectId, ref: 'User' },
    // 어떤 게시글인지 알기 위해 참조한다.
    board_id: { type: ObjectId, ref: 'Board' },
    // 대댓글을 확인하기 위한 속성이다.
    comment_id: ObjectId,
    content: String,
    user_name: String
});

/*  save 함수를 호출하기 전에 동작하는 미들웨어
    게시글에게는 누가 작성했는지, 작성자에게는 어떤 댓글인지 알려주기 위해 배열에 추가해준다.   */
CommentSchema.pre('save', function(next) {
    // Promise.all은 여러 개의 함수를 연속적으로 비동기 처리를 해준다.
    Promise.all([
    // 어떤 게시글에서 작성했는지 알기위해 해당 배열에 push 한다.
    mongoose.model('User').updateOne({ _id: this.user_id }, {$push: {comments: this.board_id}}),
    // 어떤 댓글이 작성 되었는지 알기위해 해당 배열에 push 한다.
    mongoose.model('Board').updateOne({ _id: this.board_id }, {$push: {comments: this._id}}),
    ])
    .then(
        // 정상적으로 동작했다면, 다음 함수로 넘긴다.
        next(),
        // 에러가 존재한다면 log에 출력하고 클라이언트에게 에러 코드, 에러 메세지를 보낸다.
        function (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_CREATE_FAIL));
        }
    );
});

module.exports = mongoose.model('Comment', CommentSchema);