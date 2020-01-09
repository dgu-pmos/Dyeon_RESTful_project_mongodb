var express = require('express');
var router = express.Router({ mergeParams: true });

// 계정관리 라우트
router.use('/auth', require('./Auth'));
// 게시글 라우트
router.use('/boards', require('./Boards'));

module.exports = router;