const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class boardQueries extends QueryBuilder {

    static async creatBoard(name, description, user) {
        return super.queryBuilder(`MATCH (u:User {id:"${user}"})
        CREATE (b:Board {id: "${uuid.v4()}", name:"${name}", description:"${description}", status:"1", creationDate:"${Date.now()}"})
        MERGE (u)-[r:AUTHOR]->(b)`);
    }

    static async getBoards() {
        return super.queryBuilder(`MATCH (b:Board{status:"1" }) RETURN b`);
    }

    static async getBoard(name) {
        return super.queryBuilder(`
                  MATCH path = (a:Board{name:'${name}', status:"1"})-[q:AUTHOR]-(x:User) 
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value`);
    }

    static async updateBoard(name, newName, description) {
        return super.queryBuilder(`MATCH (b:Board{name:"${name}", status:"1" }) SET b.name = "${newName}", b.description ="${description}"`);
    }

    static async deleteBoard(name) {
        return super.queryBuilder(`MATCH (b:Board{name:"${name}" , status:"1"}) SET b.status = "0"`);
    }
}

module.exports = boardQueries;
