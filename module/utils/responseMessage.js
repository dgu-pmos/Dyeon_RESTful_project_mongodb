// 결과 메세지로 사용할 문자열들의 모음
module.exports = {
    NULL_VALUE: "필요한 값이 없습니다.",
    OUT_OF_VALUE: "파라미터 값이 잘못 되었습니다.",
    SIGN_UP_SUCCESS: "회원가입 성공",
    SIGN_UP_FAIL: "회원 가입 실패",
    SIGN_IN_SUCCESS: "로그인 성공",
    SIGN_IN_FAIL: "로그인 실패",
    ALREADY_ID: "존재하는 ID 입니다.",
    NO_USER: "존재하지 않는 유저 ID 입니다.",
    MISS_MATCH_PW: "비밀번호가 일치하지 않습니다",
    EMPTY_TOKEN: "토큰이 없습니다",

    BOARD_CREATE_SUCCESS: "게시글 작성 성공",
    BOARD_CREATE_FAIL: "게시글 작성 실패",
    BOARD_READ_ALL_SUCCESS: "게시글 전체 조회 성공",
    BOARD_READ_ALL_FAIL: "게시글 전체 조회 실패",
    BOARD_READ_SUCCESS: "게시글 조회 성공",
    BOARD_READ_FAIL: "게시글 조회 실패",
    BOARD_UPDATE_SUCCESS: "게시글 수정 성공",
    BOARD_UPDATE_FAIL: "게시글 수정 실패",
    BOARD_DELETE_SUCCESS: "게시글 삭제 성공",
    BOARD_DELETE_FAIL: "게시글 삭제 실패",
    ALREADY_ID: "존재하는 ID 입니다.",
    MISS_MATCH_ID: "현재 유저는 해당 게시물의 글쓴이가 아닙니다",
    INTERNAL_SERVER_ERROR: "서버 내부 오류",
    INVALID_TOKEN: "올바르지 않은 토큰",

    COMMENT_CREATE_SUCCESS: "댓글 생성 성공",
    COMMENT_CREATE_FAIL: "댓글 생성 실패",
    COMMENT_UPDATE_SUCCESS: "댓글 수정 성공",
    COMMENT_UPDATE_FAIL: "댓글 수정 실패",
    COMMENT_READ_SUCCESS: "댓글 조회 성공",
    COMMENT_READ_FAIL: "댓글 조회 실패",
    COMMENT_DELETE_SUCCESS: "댓글 삭제 성공",
    COMMENT_DELETE_FAIL: "댓글 삭제 실패",

    LIKE_CREATE_SUCCESS: "좋아요 생성 성공",
    LIKE_CREATE_FAIL: "좋아요 생성 실패",
    LIKE_READ_SUCCESS: "좋아요 조회 성공",
    LIKE_READ_FAIL: "좋아요 조회 실패",
    LIKE_DELETE_SUCCESS: "좋아요 삭제 성공",
    LIKE_DELETE_FAIL: "좋아요 삭제 실패",
    LIKE_ALREADY: "이미 좋아요 했습니다",

    X_NULL_VALUE: (x) => `${x}가 존재하지 않습니다.`,
}