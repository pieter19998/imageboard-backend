const config = require("../config/config");
const jwt = require("jwt-simple");
const moment = require("moment");

const encode = (email, userId, role) => {
    return new Promise(resolve => {
        const payload = {
            exp: moment()
                .add(10, "days")
                .unix(),
            iat: moment().unix(),
            email: email,
            _id: userId,
            role: role
        };
        resolve(jwt.encode(payload, config.local.key));
    })
};

const decode = (token) => {
    return new Promise((resolve, reject) => {

        if (token === undefined) {
            reject({errmsg: "no token supplied"})
        }
        try {
            let key = jwt.decode(token, config.local.key);
            resolve(key);
        } catch (e) {
            reject({error_msg: "error"})
        }
    })
};

module.exports = {
    encode, decode
};
