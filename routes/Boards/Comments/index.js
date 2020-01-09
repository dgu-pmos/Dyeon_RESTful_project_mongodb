var express = require('express');
var router = express.Router({mergeParams: true});

// jwt token을 검증하기 위한 미들웨어
const authUtil = require('../../../module/utils/authUtil');
// 성공, 실패 메세지 포맷 설정 모듈
const utils = require('../../../module/utils/utils');
// 응답 메세지 모음 모듈
const responseMessage = require('../../../module/utils/responseMessage');
// 응답 코드 모음 모듈
const statusCode = require('../../../module/utils/statusCode');

const Comment = require('../../../model/Comment');
const User = require('../../../model/User');

router.post('/', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const { comment_id, content } = req.body;
    const board_id = req.params.boardIdx;
    // miss parameter가 있는지 검사한다.
    if(!board_id || !user_id || !content){
        const missParameters = Object.entries({board_id, user_id, content})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 댓글 작성자의 이름을 찾는다.
    const user_name = await User.findOne({_id: user_id});
    // 새 댓글 스키마를 생성하고 값을 넣는다.
    var comment= new Comment();
    comment.user_id = user_id;
    comment.board_id = board_id;
    comment.content = content;
    comment.user_name = user_name.name;
    
    // 대댓글의 경우, 윗 댓글의 id를 넣는다.
    if(!comment_id){
    }else{
        comment.comment_id = comment_id;
    }

    // 댓글을 저장하는 함수
    comment.save()
    .then(
        function (result) {
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.COMMENT_CREATE_SUCCESS, result));
    },
    function (err) {
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_CREATE_FAIL));
    });
});

// 댓글을 수정하는 라우트
router.put('/:commentIdx', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const content = req.body.content;
    const comment_id = req.params.commentIdx;
    // miss parameter가 있는지 검사한다.
    if(!user_id || !comment_id || !content){
        const missParameters = Object.entries({user_id, comment_id, content})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 댓글 내용을 수정하는 함수
    Comment.findOneAndUpdate({user_id: user_id, _id: comment_id}, {content: content})
    .then(
        function (result) {
            return res.status(statusCode.OK).send(utils.successTrue(responseMessage.COMMENT_UPDATE_SUCCESS, result));
    },
    function (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_UPDATE_FAIL));
    });
    
});

// 댓글 전체 조회
router.get('/', async (req, res) => {
    const board_id = req.params.boardIdx;
    if(!board_id){
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE('board_id')));
        return;
    }

    // 해당하는 게시글의 모든 댓글을 조회하는 함수
    Comment.find({board_id: board_id}, function (err, result) {
        if(err){
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_READ_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.COMMENT_READ_SUCCESS, result));
        });
});

// 댓글을 삭제하는 라우트
router.delete('/:commentIdx', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const board_id = req.params.boardIdx;
    const comment_id = req.params.commentIdx;
    // miss parameter가 있는지 검사한다.
    if(!board_id || !user_id || !comment_id){
        const missParameters = Object.entries({board_id, user_id, comment_id})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 삭제된 댓글은 "삭제된 댓글입니다." 로 변경 처리한다.
    Comment.findOneAndUpdate({user_id: user_id, board_id: board_id, _id: comment_id}, {content: "삭제된 댓글입니다."})
    .then(
        function (result) {
            return res.status(statusCode.OK).send(utils.successTrue(responseMessage.COMMENT_DELETE_SUCCESS, result));
    },
    function (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_DELETE_FAIL));
    });
});

module.exports = router;