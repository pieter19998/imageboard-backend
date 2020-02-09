const emailRegex = (email) => {
    return new Promise((resolve, reject) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            resolve();
        } else {
            reject({message : "invalid email"});
        }
    });
};

const checkUndefined = (array) =>{
    return new Promise((resolve, reject) => {
        array.forEach(async function(item){
            if (item === undefined)
            {
                return reject({message : "missing data"});
            }
        });
        resolve();
    });
};

module.exports = {
    emailRegex,checkUndefined
};
