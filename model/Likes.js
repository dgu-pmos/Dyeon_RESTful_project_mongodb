var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// comment 스키마를 정의한다.
var LikeSchema = new Schema({
    user_id: ObjectId,
    board_id: ObjectId,
});

/*  save 함수를 호출하기 전에 동작하는 미들웨어
    게시글에게는 누가 '좋아요' 했는지, 
    작성자에게는 어떤 글에 '좋아요' 했는지 알려주기 위해 배열에 추가해준다.   */
LikeSchema.pre('save', function(next) {
    Promise.all([
    // 어떤 사용자가 '좋아요' 했는지 알기위해 해당 배열에 push 한다.
    mongoose.model('Board').updateOne({ _id: this.board_id }, {$push: {likes: this.user_id}}),
    // 어떤 게시글에 '좋아요' 했는지 알기위해 해당 배열에 push 한다.
    mongoose.model('User').updateOne({ _id: this.user_id }, {$push: {likes: this.board_id}}),
    ])
    .then(
        next(),
        function (err) {
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.LIKE_CREATE_FAIL));
        }
    );
});

/*  findOneAndRemove 함수를 호출하기 전에 동작하는 미들웨어
    좋아요을 삭제하기 전에 관련된 정보들을 삭제해준다.   */
LikeSchema.pre('findOneAndRemove', function(next) {
    // getQuery를 이용해 findOneAndRemove의 입력 인자로부터 필요한 정보를 꺼낸다.
    const board_id = this.getQuery()["board_id"];
    const user_id = this.getQuery()["user_id"];
    // Promise.all은 여러 개의 함수를 연속적으로 비동기 처리를 해준다.
    Promise.all([
        // $pull을 이용해 해당 user_id를 배열로부터 빼낸다.
        mongoose.model('Board').updateOne({ _id: board_id }, { $pull: { likes: { $in: [ user_id ] }}}), 
        // $pull을 이용해 해당 board_id를 배열로부터 빼낸다.
        mongoose.model('User').updateOne( { _id: user_id }, { $pull: { likes: { $in: [ board_id ] }}})
        ])
        .then(
            next(),
            function (err) {
                console.log(err);
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.LIKE_DELETE_FAIL));
            }
        );
});

LikeSchema.pre('deleteMany', async function(next) {
    const board_id = this.getQuery()["board_id"];

    Promise.all([
        mongoose.model('User').updateMany({}, { $pull: { likes: { $in: [ board_id ] }}}),
    ])
    .then(
        // 정상적으로 동작했다면, 다음 함수로 넘긴다.
        next(),
        // 에러가 존재한다면 log에 출력하고 클라이언트에게 에러 코드, 에러 메세지를 보낸다.
        function (err) {
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.LIKE_DELETE_FAIL));
        }
    );
});

module.exports = mongoose.model('Like', LikeSchema);