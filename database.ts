import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";

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
        try {
            await fs.promises.rm(path.join(__dirname, "public", "js", "gameData.json"));
            console.log("succesfuly deleted file")
        }
        catch (err) {
            if (err) { console.log("error writing file: ", err) }
        }
    }
    catch (error) {
        console.log(error);
    }
    process.exit(0);
}

export async function getUser(username: string) {
    return await userCollection.findOne({ username: username });
}

export async function getGame(username: string) {
    return await gameCollection.findOne({ username: username });
}
export async function createGame(username: string) {
    console.log("create");
    const game = {
        username,
        firstLogin: true,
        player: {
            x: 450,
            y: 450,
            direction: "down",
            capturedPokemon: [],
        },
        npcs: {
            1: { x: 200, y: 300, pokemon: undefined },
            2: { x: 700, y: 250, pokemon: undefined },
            3: { x: 300, y: 1050, pokemon: undefined },
            4: { x: 700, y: 750, pokemon: undefined },
            5: { x: 900, y: 950, pokemon: undefined },
        }
    }
    await gameCollection.insertOne(game)

    try {
        await fs.promises.writeFile(path.join(__dirname, "public", "js", "gameData.json"), JSON.stringify(game, null, 2));
        console.log("succesfuly wrote file")
    }
    catch (err) {
        if (err) { console.log("error writing file: ", err) }
    }
};
export async function saveGame(username: string, gameSave: any) {
    console.log("save");
    const updateData = simplifyData(gameSave);
    await gameCollection.updateOne({username: username},{$set:updateData})
    function simplifyData(obj: any, prefix = "", result: any = {}) {
        for (const key in obj) {
            const value = obj[key];
            const path = prefix === "" ? key : `${prefix}.${key}`;
            if (typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                simplifyData(value, path, result)
            }
            else {
                result[path] = value
            }
        }
        return result;
    }
}

export async function loadGame(username: string) {
    console.log("load");
    const game = await gameCollection.findOne({ username: username });
    try {
        await fs.promises.writeFile(path.join(__dirname, "public", "js", "gameData.json"), JSON.stringify(game, null, 2));
        console.log("succesfuly wrote file")
    }
    catch (err) {
        if (err) { console.log("error writing file: ", err) }
    }
}
export async function resetGame(username: string) {
    console.log("reset");
    await gameCollection.deleteMany({ username: username });
}

