var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// board 스키마를 정의한다.
var boardSchema = new Schema({
    // 작성자 정보를 보여주기 위해 참조한다.
    user_id: { type: ObjectId, ref: 'User' },
    title: String,
    content: String,
    active: Number,
    // 누가, 얼마나 '좋아요' 했는지 확인하기 위해 참조한다.
    likes: [{ type: ObjectId, ref: 'User' }],
    // 게시글에 달린 댓글들을 보여주기 위해 참조한다.
    comments: [{ type: ObjectId, ref: 'Comment' }]
});

/*  findOneAndRemove 함수를 호출하기 전에 동작하는 미들웨어
    게시글을 삭제하기 전에 관련된 댓글과 좋아요를 삭제해준다.   */
boardSchema.pre('findOneAndRemove', function(next) {
    // getQuery를 이용해 findOneAndRemove의 입력 인자로부터 필요한 정보를 꺼낸다.
    const board_id = this.getQuery()["_id"];
    // Promise.all은 여러 개의 함수를 연속적으로 비동기 처리를 해준다.
    Promise.all([
        // likes collection에서 board_id가 일치하는 document들을 삭제한다.
        mongoose.model('Like').deleteMany({board_id: board_id}),
        // comments collection에서 board_id가 일치하는 document들을 삭제한다.
        mongoose.model('Comment').deleteMany({board_id: board_id}),
    ])
    .then(
        // 정상적으로 동작했다면, 다음 함수로 넘긴다.
        next(),
        // 에러가 존재한다면 log에 출력하고 클라이언트에게 에러 코드, 에러 메세지를 보낸다.
        function (err) {
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_DELETE_FAIL));
        }
    );
});

module.exports = mongoose.model('Board', boardSchema);
