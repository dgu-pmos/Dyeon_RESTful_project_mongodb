var express = require('express');
var router = express.Router({mergeParams: true});

// 회원가입 라우트
router.use('/signup', require('./signup'));
// 로그인 라우트
router.use('/signin', require('./signin'));

module.exports = router;
