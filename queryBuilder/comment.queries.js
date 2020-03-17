const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class threadQueries extends QueryBuilder{

    static async createCommentOnThread(text,image = null,threadId,user) {
        return super.queryBuilder(`
                        MATCH (t:Thread {id:"${threadId}"})
                        MATCH (u:User {id:"${user}"})
                        CREATE (c:Comment {id: "${uuid.v4()}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
                        MERGE (c)-[r:REPLY]->(t)
                        MERGE (u)-[s:AUTHOR]->(c)
                        `);
    }

    static async createCommentOnComment(text,image = null,commentId,user) {
        return super.queryBuilder(`
                        MATCH (a:Comment {id:"${commentId}"})
                        MATCH (u:User {id:"${user}"})
                        CREATE (c:Comment {id: "${uuid.v4()}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
                        MERGE (c)-[r:REPLY]->(a)
                        MERGE (u)-[s:AUTHOR]->(c)
                        `);
    }

    static async getComment(id) {
        return super.queryBuilder(`MATCH (c:Comment{id:"${id}" , status:"1" }) RETURN c`);
    }

    static async getComments(thread) {
        return super.queryBuilder(`
                  MATCH path = (t:Thread {id:"${thread}"})<-[r*]-(c)
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value
        `);
    }

    //todo delete by id
    static async deleteComment(id) {
        return super.queryBuilder(`MATCH (t:Board{name:"${id}" , status:"1"}) SET u.status = "0"`);
    }
}

module.exports = threadQueries;
