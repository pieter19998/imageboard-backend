const config = require("../config/config");
const jwt = require("jwt-simple");
const moment = require("moment");

const encode = (username, userId, role) => {
    return new Promise(resolve => {
        const payload = {
            exp: moment()
                .add(100, "days")
                .unix(),
            iat: moment().unix(),
            username: username,
            id: userId,
            role: role
        };
        resolve(jwt.encode(payload, config.local.key));
    })
};

const decode = (token) => {
    return new Promise((resolve, reject) => {
        if (token === undefined) {
            reject({message: "no token supplied"})
        }
        try {
            let key = jwt.decode(token, config.local.key);
            resolve(key);
        } catch (e) {
            reject({message: "can't decode token"})
        }
    })
};

module.exports = {
    encode, decode
};
