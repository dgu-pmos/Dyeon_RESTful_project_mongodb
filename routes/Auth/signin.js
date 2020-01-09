var express = require('express');
var router =  express.Router({mergeParams: true});

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const responseMessage = require('../../module/utils/responseMessage');

const User = require('../../model/User');
const jwt = require('../../module/utils/jwt');

router.post('/', async (req, res) => {
    // request body로부터 로그인 정보를 받는다.
    const {email, password} = req.body;
    // miss parameter가 있는지 검사한다.
    if(!email || !password){
        // entries 메소드는 객체가 가지고 있는 모든 프로퍼티를 키와 값 쌍으로 배열 형태로 반환해준다.
        const missParameters = Object.entries({email, password})
        // 배열로 바꾼 상태에서 value 값이 undefined 인 경우, missParameters 변수에 추가된다.
        .filter(it => it[1] == undefined).map(it => it[0]).join(',');
        res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.X_NULL_VALUE(missParameters)));
        return;
    }

    // 존재하는 계정인지 확인한다.
    const check_id = await User.findOne({ email: email });

    // 존재하지 않는다면 에러 메세지 출력
    if(!check_id){
        return res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.NO_USER));
    }
    // 패스워드가 일치하지 않는다면 에러 메세지 출력
    if(check_id.password != password){
        return res.status(statusCode.BAD_REQUEST).send(utils.successFalse(responseMessage.MISS_MATCH_PW));
    }
    const user_id = check_id._id;
    const user_name = check_id.name;

    const json = { user_id, user_name };

    res.status(statusCode.OK).send(utils.successTrue(responseMessage.SIGN_IN_SUCCESS, jwt.sign(json)))
    return;
});

module.exports = router;