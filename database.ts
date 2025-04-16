import { MongoClient } from "mongodb";

const dbConnectionString = "mongodb+srv://DragoniteUser:Dragonite@cluster0.zhqlzpr.mongodb.net/";
const database = 'DragoniteDB';
export const client = new MongoClient(dbConnectionString);
export const userCollection = client.db(database).collection('Users');

export async function connect() {
    try{
        await client.connect();
        process.on("SIGINT", exit);
    }
    catch(error){
        console.log(error);
    }
}
async function exit(){
    try{
        await client.close();
    }
    catch(error){
        console.log(error);
    }
    process.exit(0);
}

export async function getUser(filter: Object = {}){
    return await userCollection.findOne(filter);
}