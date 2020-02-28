const config = require('../config/config');
const queryBuilder = require('neo4j-driver');
const driver = queryBuilder.driver(
    config.neo4jLocal.url,
    queryBuilder.auth.basic(config.neo4jLocal.username, config.neo4jLocal.password), {disableLosslessIntegers: true}
);

class QueryBuilder {

    static async queryBuilder(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const session = await driver.session();
                const result = await session.run(query);
                await session.close();
                if (query.toLowerCase().includes("return")) resolve(result.records.map(record => {return record.get(0)}));
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    }
}

module.exports = QueryBuilder;
