const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class UserQueries extends QueryBuilder {

    static async createUser(username, email, hash) {
        return super.queryBuilder(`CREATE (a:User {id: "${uuid.v4()}", username:"${username}", email:"${email}", password: "${hash}", status:"1", role:"user"}) RETURN a`)
    }

    static async getUser(username) {
        return super.queryBuilder(`MATCH (u:User{username:"${username}" , status:"1" }) RETURN u`);
    }

    static async deleteUser(id) {
        return super.queryBuilder(`MATCH (u:User{id:"${id}"}) SET u.status = "0"`);
    }
}

module.exports = UserQueries;
