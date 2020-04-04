const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class UserQueries extends QueryBuilder {

    static async createUser(username, email, hash, id, gender, dateOfBirth ,role) {
        return super.queryBuilder(`CREATE (a:User {id: "${id}", username:"${username}", email:"${email}", password: "${hash}", gender:"${gender}", dateOfBirth: "${dateOfBirth}", status:"1", role:"${role}"}) RETURN a`)
    }

    static async getUser(username) {
        return super.queryBuilder(`MATCH (u:User{username:"${username}" , status:"1" }) RETURN u`);
    }

    static async updateUser(username, email, id, gender, dateOfBirth ,role) {
        return super.queryBuilder(`MATCH (u:User{id:"${id}", status:"1" }) SET u.username = "${username}", u.email ="${email}", u.gender ="${gender}", u.dateOfBirth ="${dateOfBirth}", u.role ="${role}"`);
    }

    static async deleteUser(id) {
        return super.queryBuilder(`MATCH (u:User{id:"${id}"}) SET u.status = "0"`);
    }
}

module.exports = UserQueries;
