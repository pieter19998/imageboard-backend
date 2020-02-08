const config = require('../config/config');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    config.neo4jLocal.url,
    neo4j.auth.basic(config.neo4jLocal.username, config.neo4jLocal.password), {disableLosslessIntegers: true}
);
const session = driver.session();

class neo4jDb {
    static async createUser(userName, email, hash) {
        const session = driver.session();
        await session.run(
            `CREATE (a:User {userName:"${userName}", email:"${email}", password: "${hash}", status:"1", role:"user"})`
        );
        await session.close();
    }
    static async getUserId(userName) {
        const session = driver.session();
        const result = await session.run(
            `MATCH (n:User{userName:"${userName}"}) RETURN ID(n)`
        );

        await session.close();
        return await result.records[0].get(0);
    }
    static async getUser(userName) {
        const session = driver.session();
        const result = await session.run(
            `MATCH (n:User{userName:"${userName}"}) RETURN COLLECT(n)`
        );
        await session.close();
        return await result.records[0].get(0);
    }
    static async updateUser(userName, email) {
        const session = driver.session();
        await session.run(
            ``
        );
    }
}


module.exports = neo4jDb;
