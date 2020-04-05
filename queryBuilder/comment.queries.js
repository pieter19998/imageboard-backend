const QueryBuilder = require('./queryBuilder');
const uuid = require("uuid");

class threadQueries extends QueryBuilder {

    static async createCommentOnThread(text, image, threadId, user) {
        return super.queryBuilder(`
            MATCH (t:Thread {id:"${threadId}"})
            MATCH (u:User {id:"${user}"})
            CREATE (c:Comment {id: "${uuid.v4()}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
            MERGE (c)-[r:REPLY]->(t)
            MERGE (u)-[s:AUTHOR]->(c)
                        `);
    }

    static async createCommentOnComment(text, image, commentId, user) {
        return super.queryBuilder(`
            MATCH (a:Comment {id:"${commentId}"})
            MATCH (u:User {id:"${user}"})
            CREATE (c:Comment {id: "${uuid.v4()}", text:"${text}", image:"${image}", status:"1", creationDate:"${Date.now()}"})
            MERGE (c)-[r:REPLY]->(a)
            MERGE (u)-[s:AUTHOR]->(c)
                        `);
    }

    static async getComment(id) {
        return super.queryBuilder(`
            MATCH path = (c:Comment{id:'${id}', status:"1"})-[a:AUTHOR]-(u:User) 
            WITH collect(path) as paths
            CALL apoc.convert.toTree(paths) yield value
            RETURN value
        `);
    }

    static async getComments(thread) {
        return super.queryBuilder(`
            MATCH path = (t:Thread {id:"${thread}", status:"1"})<-[r*]-(c)
            WITH collect(path) as paths
            CALL apoc.convert.toTree(paths) yield value
            RETURN value
        `);
    }

    static async updateComment(id, text, image) {
        return super.queryBuilder(`
            MATCH (c:Comment{id:"${id}", status:"1" })
            SET c.text = "${text}", c.image ="${image}"
        `);
    }

    static async deleteComment(id, user) {
        return super.queryBuilder(`
                   MATCH (c:Comment{id:"${id}"})-[AUTHOR]-(u:User{username:"${user}"})
                   SET c.status = "0"`);
    }
}

module.exports = threadQueries;
