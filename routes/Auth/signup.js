var express = require('express');
var router =  express.Router({mergeParams: true});

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const responseMessage = require('../../module/utils/responseMessage')

const User = require('../../model/User');

router.post('/', async (req, res) => {
    // request body로부터 가입 정보를 받는다.
    const {email, password, name} = req.body;
    // miss parameter가 있는지 검사한다.
    if(!email || !password || !name){
        // entries 메소드는 객체가 가지고 있는 모든 프로퍼티를 키와 값 쌍으로 배열 형태로 반환해준다.
        const missParameters = Object.entries({email, password, name})
        // 배열로 바꾼 상태에서 value 값이 undefined 인 경우, missParameters 변수에 추가된다.
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 새 사용자 document를 생성하고 값을 채운다.
    var user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;

    // 새 document를 DB에 저장한다.
    user.save(function (err, result) {
        if(err){
        // error가 존재하면 실패 메세지
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.SIGN_UP_FAIL));
        }
        res.status(statusCode.OK).send(utils.successTrue(responseMessage.SIGN_UP_SUCCESS, result));
    });
});

module.exports = router;