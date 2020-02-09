const config = require('../config/config');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    config.neo4jLocal.url,
    neo4j.auth.basic(config.neo4jLocal.username, config.neo4jLocal.password), {disableLosslessIntegers: true}
);

class QueryBuilder {

    static async queryBuilder(query) {
        return new Promise((resolve, reject) => {
            try {
                const session = driver.session();
                const result = session.run(query);
                session.close();
                resolve(result.records[0].get(0));
            }catch (error) {
                reject({message:"not found"})
            }
        })
    }

    static async createUser(username, email, hash) {
        return this.queryBuilder(`CREATE (a:User {username:"${username}", email:"${email}", password: "${hash}", status:"1", role:"user"}) RETURN a`)
    }

    static async getUserId(username) {
        return this.queryBuilder(`MATCH (n:User{username:"${username}", status:"1" }) RETURN ID(n)`)
    }

    static async getUser(username) {
        return this.queryBuilder(`MATCH (n:User{username:"${username}" , status:"1" }) RETURN n`);
    }

    static async login(username, password) {
        return this.queryBuilder(`MATCH (n:User{username:"${username}", password:"${password}" , status:"1"}) RETURN n`);
    }

    static async deleteUser(username, id) {
        return this.queryBuilder(`MATCH (u:User{username:"${username}" , status:"1"}) SET u.status = "0" RETURN u`);
    }
}

module.exports = QueryBuilder;
