import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import { Pokemon } from "./interfaces";

dotenv.config();

const dbConnectionString: string = process.env.MONGO_URI || "";
const database = 'DragoniteDB';
export const client = new MongoClient(dbConnectionString);
export const userCollection = client.db(database).collection("Users");
export const gameCollection = client.db(database).collection("Game");
export const pokemonCollection = client.db(database).collection("Pokemon");

export async function connect() {
    try {
        // await fetchPokemon();
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
            if (err) { console.log("error deleting file: ", err) }
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
        player: {
            x: 450,
            y: 450,
            direction: "down",
            sprite: "",
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
    setGameData(game);
};
export async function saveGame(username: string, gameSave: any) {
    console.log("save");
    const updateData = simplifyData(gameSave);
    await gameCollection.updateOne({ username: username }, { $set: updateData })


    function simplifyData(obj: any, prefix = "", result: any = {}) {
        for (const key in obj) {
            const value = obj[key];
            const path = prefix === "" ? key : `${prefix}.${key}`;
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
    await setGameData(game);
}
export async function deleteGame(username: string) {
    console.log("reset");
    await gameCollection.deleteOne({ username: username });
    await setGameData({username: username})
}

export async function loadPokemon() {
    if (await pokemonCollection.countDocuments() === 0) {
        pokemonCollection.insertMany(await fetchPokemon());
    }
}

async function fetchPokemon() {
    const pokemonList: Pokemon[] = [];
    const pokeFetch1 = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
    const pokeJson1 = await pokeFetch1.json();
    const pokeData = pokeJson1["results"];
    const PokeFetch2 = await Promise.all(pokeData.map((value: any) => fetch(value.url)));
    const pokeJson2 = await Promise.all(PokeFetch2.map((value: any) => value.json()));
    for (let i = 0; i < pokeJson2.length; i++) {
        const pokemon = pokeJson2[i];
        await pokemonList.push({
            abilities: pokemon.abilities,
            base_experience: pokemon.base_experience,
            cries: pokemon.cries,
            //forms: pokemon.forms,
            //game_indices: pokemon.game_indices,
            //height: pokemon.height,
            //held_items: pokemon.held_items,
            id: pokemon.id,
            is_default: pokemon.is_default,
            //location_area_encount: pokemon.location_area_encount,
            moves: pokemon.moves,
            name: pokemon.name,
            //order: pokemon.order,
            //past_abilities: pokemon.past_abilities,
            //past_types: pokemon.past_types,
            species: pokemon.species,
            sprites: pokemon.sprites,
            //other: pokemon.other,
            //versions: pokemon.versions,
            stats: [
                pokemon.stats[0], //hp
                pokemon.stats[1], //atk
                pokemon.stats[2], //def
                pokemon.stats[3], //spAtk
                pokemon.stats[4], //spDef
                pokemon.stats[5], //speed
                {          //[6]
                    base_stat: 0, effort: 0, stat: { name: "wins", url: "", }
                },
                {          //[7]
                    base_stat: 0, effort: 0, stat: { name: "losses", url: "", }
                },
                // { hp: pokemon.stats[0].base_stat },
                // { atk: pokemon.stats[1].base_stat },
                // { def: pokemon.stats[2].base_stat },
                // { spAtk: pokemon.stats[3].base_stat },
                // { spDef: pokemon.stats[4].base_stat },
                // { speed: pokemon.stats[5].base_stat },
                // { wins: 0 },
                // { losses: 0 },
            ],
            types: pokemon.types,
            //weight: pokemon.weight,
            nickname: "",
            evolution_chain: [],
            isKnown: false,
        });
        const pokeFetch3 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
        const pokeJson3 = await pokeFetch3.json();
        const pokeEvolution = await pokeJson3.evolution_chain.url;
        const pokeFetch4 = await fetch(pokeEvolution);
        const pokeJson4 = await pokeFetch4.json();
        let chain = pokeJson4.chain;
        while (chain) {
            pokemonList[i].evolution_chain.push({ name: chain.species.name, sprite: "" });
            chain = chain.evolves_to.length ? chain.evolves_to[0] : null;
        }
    };
    pokemonList.forEach((pokemon) => {
        pokemon.evolution_chain.forEach((evolution) => {
            const match = pokemonList.find((value) => { return evolution.name === value.name });
            evolution.sprite = match ? match.sprites.front_default : "/public/assets/pikachu_silouhette.png";
        })
    })

    return pokemonList;
}

export async function getGameData() {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, "public", "js", "gameData.json"), "utf8");
        return JSON.parse(data);
    }
    catch (err) {
        if (err) { console.log("error reading file: ", err) }
    }
}
export async function setGameData(data: any) {
    try {
        const filePath = path.join(__dirname, "public", "js", "gameData.json")
        // await fs.promises.rm(filePath);
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log("succesfuly wrote file")
    }
    catch (err) {
        if (err) { console.log("error writing file: ", err) }
    }
}
export async function updateGameData(obj: any) {
    try {
        let gameData = await getGameData();
        for(const key in obj){
            gameData[key]= obj[key];
        }
        await setGameData(gameData);
    }
    catch (err) {
        console.log(err);
    }
}