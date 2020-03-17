const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class threadQueries extends QueryBuilder {

    static async createThread(title, text, image = null, board, user) {
        return super.queryBuilder(`
                        MATCH (b:Board {name:"${board}"})
                        MATCH (u:User {id:"${user}"})
                        CREATE (t:Thread {id: "${uuid.v4()}", title:"${title}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
                        MERGE (t)-[r:REPLY]->node(b)
                        MERGE (u)-[s:AUTHOR]->(t)
        `);
    }

    static async getThread(thread) {
        return super.queryBuilder(`
                  MATCH path = (t:Thread {id:"${thread}"})<-[r*]-(c)
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value
        `);
    }

    static async getThreadsByBoard(board) {
        return super.queryBuilder(`
                MATCH path = (b:Board {name:"${board}"})<-[r:REPLY]-(c)
                return c
        `);
    }

    //todo delete by id
    static async deleteThread(id) {
        return super.queryBuilder(`MATCH (t:Board{name:"${id}" , status:"1"}) SET u.status = "0"`);
    }
}

module.exports = threadQueries;
