const emailRegex = (email) => {
    return new Promise((resolve, reject) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            resolve();
        } else {
            reject({errmsg: "invalid email"});
        }
    });
};

module.exports = {
    emailRegex
};
