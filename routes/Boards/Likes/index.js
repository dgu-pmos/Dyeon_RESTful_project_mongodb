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

const Like = require('../../../model/Likes');

router.post('/', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const board_id = req.params.boardIdx;
    // miss parameter가 있는지 검사한다.
    if(!board_id || !user_id){
        const missParameters = Object.entries({board_id, user_id})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 이미 '좋아요'를 했는지 검사한다.
    const check_like = await Like.find({board_id: board_id, user_id: user_id});
    if(check_like.length!=0){
        return res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.LIKE_ALREADY));
    }

    var like= new Like();
    like.user_id = user_id;
    like.board_id = board_id;

    like.save()
    .then(
        function (result) {
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.LIKE_CREATE_SUCCESS, result));
    },
    function (err) {
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.LIKE_CREATE_FAIL));
    });
});


router.get('/', async (req, res) => {
    const board_id = req.params.boardIdx;

    if(!board_id){
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE('board_id')));
        return;
    }

    // count 함수를 이용해서 총 '좋아요' 수를 보여준다.
    Like.count({board_id: board_id}, function (err, result) {
        if(err){
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.COMMENT_READ_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.COMMENT_READ_SUCCESS, result));
        });
});

// 
router.delete('/', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const board_id = req.params.boardIdx;
    // miss parameter가 있는지 검사한다.
    if(!board_id || !user_id){
        const missParameters = Object.entries({board_id, user_id})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    Like.findOneAndRemove({board_id: board_id, user_id: user_id})
    .then(
        function (result) {
            return res.status(statusCode.OK).send(utils.successTrue(responseMessage.LIKE_DELETE_SUCCESS, result));
    },
    function (err) {
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.LIKE_DELETE_FAIL));
    });
});

module.exports = router;