const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class threadQueries extends QueryBuilder {

    static async createThread(title, text, image = null, board, user) {
        return super.queryBuilder(`
                        MATCH (b:Board {name:"${board}"})
                        MATCH (u:User {id:"${user}"})
                        CREATE (t:Thread {id: "${uuid.v4()}", title:"${title}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
                        MERGE (t)-[r:REPLY]->(b)
                        MERGE (u)-[s:AUTHOR]->(t)
        `);
    }

    static async getThread(thread) {
        return super.queryBuilder(`
        `);
    }

    static async getThreadsByBoard(board) {
        return super.queryBuilder(`
                  MATCH path = (a:Board{name:'${board}', status:"1"})-[r:REPLY]-(t:Thread)-[q:AUTHOR]-(x:User) 
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value`);
    }

    //todo delete by id
    static async deleteThread(id) {
        return super.queryBuilder(`MATCH (t:Board{name:"${id}" , status:"1"}) SET u.status = "0"`);
    }
}

module.exports = threadQueries;
