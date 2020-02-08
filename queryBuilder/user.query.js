// class QueryBuilder {
//
//     constructor() {
//         const config = require('../config/config');
//         const neo4j = require('neo4j-driver');
//         const driver = neo4j.driver(
//             config.neo4jLocal.url,
//             neo4j.auth.basic(config.neo4jLocal.username, config.neo4jLocal.password), {disableLosslessIntegers: true}
//         );
//         this.session = driver.session();
//     }
//
//     async createUser(userName, email, hash) {
//
//         await this.session.run(
//             `CREATE (a:User {userName:"${userName}", email:"${email}", password: "${hash}", status:"1", role:"user"})`
//         );
//         await this.session.close();
//     }
//     async getUserId(userName) {
//         const result = await this.session.run(
//             `MATCH (n:User{userName:"${userName}"}) RETURN ID(n)`
//         );
//         await this.session.close();
//         return await result.records[0].get(0);
//     }
//     async getUser(userName) {
//         const result = await this.session.run(
//             `MATCH (n:User{userName:"${userName}"}) RETURN COLLECT(n)`
//         );
//         await this.session.close();
//         return await result.records[0].get(0);
//     }
//     async updateUser(userName, email) {
//         await this.session.run(
//             ``
//         );
//     }
// }
// module.exports = QueryBuilder;
