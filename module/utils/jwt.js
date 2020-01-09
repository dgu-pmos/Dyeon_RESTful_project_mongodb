const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "jwtSecretKey";

const options = {
    algorithm: "HS256",
    expiresIn: "1d",
    issuer: "withDev"
}

module.exports = {
    // token을 생성하는 함수
    sign: (user) => {
        // token에 들어갈 정보
        const payload = {
            user_id : user.user_id,
            name : user.name
        };
        const result = {
            // payload, key value, option들을 이용해 jwt token을 생성한다.
            token: jwt.sign(payload, secretOrPrivateKey, options)           
        };
        // token을 반환한다.
        return result;
    },    

    verify: (token) => {
        let decoded;
        try{
            decoded = jwt.verify(token,secretOrPrivateKey);
        } catch (err){
            // 유효기간 만료
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return -3;
            // 잘못된 token
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return -2;
            // error 발생
            } else {
                console.log("error");
                return -2;
            }
        }
        // error가 없을 시, decoded로 return을 한다. 
        return decoded;
        }
    } 
