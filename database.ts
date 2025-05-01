import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const dbConnectionString: string = process.env.MONGO_URI || "";
const database = 'DragoniteDB';
export const client = new MongoClient(dbConnectionString);
export const userCollection = client.db(database).collection('Users');
export const gameCollection = client.db(database).collection('Game');

export async function connect() {
    try {
        await client.connect();
        process.on("SIGINT", exit);
    }
    catch (error) {
        console.log(error);
    }
}
async function exit() {
    try {
        await client.close();
    }
    catch (error) {
        console.log(error);
    }
    process.exit(0);
}

export async function getUser(filter: Object = {}) {
    return await userCollection.findOne(filter);
}

async function createGame() {
    const playerObj = {
        player: {
            x: 450,
            y: 450,
            direction: "down",
        }
    };
    const npcsObj = [
        { npc: { x: 200, y: 300, } },
        { npc: { x: 700, y: 250, } },
        { npc: { x: 300, y: 1050, } },
        { npc: { x: 700, y: 750, } },
        { npc: { x: 900, y: 950, } },
    ]


    await gameCollection.insertOne(playerObj);
    await gameCollection.insertMany(npcsObj);
};

async function loadGame() {
    const player = await gameCollection.find({ "player": { "$exists": 1 } }).toArray();
    const npcs = await gameCollection.find({ "npc": { "$exists": 1 } }).toArray();
    console.log(player);
    console.log(npcs);
}
async function resetGame() {
    await gameCollection.deleteMany({ "player": { "$exists": 1 } });
    await gameCollection.deleteMany({ "npc": { "$exists": 1 } });
}

async function test() {
    await createGame();
    await loadGame();
    await resetGame();
    await loadGame();
}
