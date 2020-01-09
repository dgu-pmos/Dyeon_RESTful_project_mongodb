var express = require('express');
var router = express.Router({mergeParams: true});

// jwt token을 검증하기 위한 미들웨어
const authUtil = require('../../module/utils/authUtil');
// 성공, 실패 메세지 포맷 설정 모듈
const utils = require('../../module/utils/utils');
// 응답 메세지 모음 모듈
const responseMessage = require('../../module/utils/responseMessage');
// 응답 코드 모음 모듈
const statusCode = require('../../module/utils/statusCode');

const Board = require('../../model/Board');

// comments로 넘겨주는 라우트
router.use('/:boardIdx/comments', require('./Comments'));
// likes로 넘겨주는 라우트
router.use('/:boardIdx/likes', require('./Likes'));

// 게시글을 작성하는 라우트
router.post('/', authUtil.validToken, async (req, res) => {
    // authUtil 미들웨어로부터 user_id 를 받는다.
    const user_id = req.decoded.user_id;
    // request body로부터 게시글 입력 정보들을 받는다.
    const {title, content} = req.body;
    // miss parameter가 있는지 검사한다.
    if(!user_id || !title || !content){
        const missParameters = Object.entries({user_id, title, content})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }
    
    // 게시글 스키마 객체를 생성하고 값들을 입력한다. 
    var board = new Board();
    board.user_id = user_id;
    board.title = req.body.title;
    board.content = req.body.content;
    // active = 1 공개 | active = 0 비공개
    board.active = 1;

    // 입력된 스키마 객체를 저장하는 함수
    board.save(function (err, result) {
        if(err){
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_CREATE_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.BOARD_CREATE_SUCCESS, result));
    });
});

// 게시글을 수정하는 라우트
router.put('/:board_id', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    const { title, content, active } = req.body;
    const board_id = req.params.board_id;
    // update 함수에서 조건 필터로 사용한다.
    const filter = {
        _id : board_id,
        user_id : user_id
    };
    // update 할 항목들을 삽입할 배열이다.
    var update = {};

    // miss parameter가 있는지 검사한다.
    if(!user_id || !board_id){
        const missParameters = Object.entries({user_id, board_id})
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    if(title.length!=0){
        update.title = title;
    }
    if(content.length!=0){
        update.content = content;
    }
    if(active!=undefined){
        update.active = active;
    }

    // 게시글을 수정하는 함수
    Board.findOneAndUpdate(filter, update, function (err, result) {
        if(err){
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_UPDATE_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.BOARD_UPDATE_SUCCESS, result));
    });
});

// 전체 게시글 조회 라우트
router.get('/', async (req, res) => {
    /*  populate 메소드는 reference 속성을 이용해 다른 collection으로부터 
        정보들을 가져오는 기능을 수행한다.
        입력 인자로는 기준이 될 속성 값을 넣어야 한다.  */
    Board.find().populate('comments').populate('user_id').exec((err, result) => {
        if(err){
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_READ_ALL_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.BOARD_READ_ALL_SUCCESS, result));
    });
});

// 상세 게시글 조회 라우트
router.get('/:boardIdx', async (req, res) => {
    Board.findOne({_id: req.params.boardIdx}, function (err, result) {
        if(err){
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_READ_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.BOARD_READ_SUCCESS, result));
    });
});

// 특정 게시글 삭제 라우트
router.delete('/:boardIdx', authUtil.validToken, async (req, res) => {
    const user_id = req.decoded.user_id;
    // board_id는 URL 파라미터로 받고, user_id는 jwt token으로 받는다.
    Board.findOneAndRemove({_id: req.params.boardIdx, user_id: user_id}, function (err, result) {
        if(err){
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(utils.successFalse(responseMessage.BOARD_DELETE_FAIL));
        }
        return res.status(statusCode.OK).send(utils.successTrue(responseMessage.BOARD_DELETE_SUCCESS, result));
    });
});

module.exports = router;