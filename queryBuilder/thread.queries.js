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

    static async getThread(id) {
        return super.queryBuilder(`
                  MATCH path = (t:Thread{id:'${id}', status:"1"})-[a:AUTHOR]-(u:User) 
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value
        `);
    }

    static async getThreadsByBoard(board) {
        return super.queryBuilder(`
                  MATCH path = (a:Board{name:'${board}', status:"1"})-[r:REPLY]-(t:Thread)-[q:AUTHOR]-(x:User) 
                  WITH collect(path) as paths
                  CALL apoc.convert.toTree(paths) yield value
                  RETURN value`);
    }

    static async updateThread(id,title,text) {
        return super.queryBuilder(`MATCH (t:Thread{id:"${id}", status:"1" }) SET t.title = "${title}", t.text ="${text}"`);
    }

    static async deleteThread(id,user) {
        return super.queryBuilder(`
                   MATCH (t:Thread{id:"${id}"})-[AUTHOR]-(u:User{username:"${user}"})
                   SET t.status = "0"`);
    }

    static async getVote(threadId) {
        return super.queryBuilder(`
            MATCH path = (t:Thread{id:'${threadId}'})-[r:VOTE]-(v:Vote) RETURN count(v)
        `);
    }

    static async createVote(threadId,userId) {
        return super.queryBuilder(`
            MATCH (a:Thread {id:"${threadId}"})
            MATCH (u:User {id:"${userId}"})
            CREATE (v:Vote)
            MERGE (u)-[:VOTER]->(v)
            MERGE (v)-[:VOTE]->(a)
        `);
    }

    static async removeVote(threadId,userId) {
        return super.queryBuilder(`
            MATCH (a:Thread {id:"${threadId}"})
            MATCH (u:User {id:"${userId}"})
            MATCH test = (u)-[v:VOTER]->(c:Vote)-[m:VOTE]->(a)
            DELETE v
            DELETE m
            DELETE c
        `);
    }
}

module.exports = threadQueries;
