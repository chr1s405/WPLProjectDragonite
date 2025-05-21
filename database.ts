import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { Npc, NpcsDB, Player, Pokemon, User, WildPokemon } from "./interfaces";
import bcrypt from "bcrypt";

dotenv.config();

const dbConnectionString: string = process.env.MONGO_URI || "";
const database = 'DragoniteDB';
export const client = new MongoClient(dbConnectionString);
export const userCollection = client.db(database).collection<User>("Users");
export const playerCollection = client.db(database).collection<Partial<Player>>("Players");
export const npcsCollection = client.db(database).collection<NpcsDB>("Npcs");
export const pokemonCollection = client.db(database).collection<Partial<WildPokemon>>("Pokemon");
export let allPokemon: Pokemon[];

export async function connect() {
    try {
        await client.connect();
        allPokemon = await fetchPokemon();
        // deleteData();
        process.on("SIGINT", exit);
    }
    catch (error) {
        console.log(error);
    }
}
async function exit() {
    process.exit(0);
}
export async function deleteData() {
    userCollection.deleteMany();
    playerCollection.deleteMany();
    npcsCollection.deleteMany();
    pokemonCollection.deleteMany();
}
export async function getUser(username: string) {
    return await userCollection.findOne({ username: username });
}
export async function createUser(user: User) {
    user.id = await userCollection.countDocuments();
    await userCollection.insertOne(user);
}
export async function getPlayer(userId: number) {
    return await playerCollection.findOne({ userId });
}
export async function setPlayer(userId: number, playerData: any) {
    playerCollection.updateOne({ userId }, { $set: playerData });
}
export async function getNpcs(userId: number) {
    const npcs = await npcsCollection.findOne({ userId })
    if (npcs) { return npcs.npcs; }
    else { return null;}
}
export async function setNpcs(userId: number, npcsData: any) {
    npcsCollection.updateOne({ userId }, { $set: getDotNotation(npcsData, "npcs") });
}
export function getpokemon() {
    return allPokemon;
}
function getDotNotation(obj: any, prefix = "", result: any = {}) {
    for (const key in obj) {
        const value = obj[key];
        const path = prefix === "" ? key : `${prefix}.${key}`;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            getDotNotation(value, path, result)
        }
        else {
            result[path] = value
        }
    }
    return result;
}
export async function createGame(userId: number) {
    const player = { userId, x: 450, y: 450, direction: "down", sprite: "Red.png", portrait: "/assets/characters/RedBig.png", companion: {}, capturedPokemon: [], knownPokemon: [] };
    await playerCollection.insertOne(player);
    const npcs = [
        { id: 0, x: 200, y: 300, sprite: "Red.png", companion: {} },
        { id: 0, x: 500, y: 250, sprite: "Red.png", companion: {} },
        { id: 0, x: 700, y: 250, sprite: "Red.png", companion: {} },
        { id: 0, x: 200, y: 750, sprite: "Red.png", companion: {} },
        { id: 0, x: 600, y: 750, sprite: "Red.png", companion: {} },
        { id: 0, x: 600, y: 1000, sprite: "Red.png", companion: {} },
        { id: 0, x: 1050, y: 600, sprite: "Red.png", companion: {} },
        { id: 0, x: 2350, y: 250, sprite: "Red.png", companion: {} },
        { id: 0, x: 2750, y: 1100, sprite: "Red.png", companion: {} },
        { id: 0, x: 3200, y: 1200, sprite: "Red.png", companion: {} },
        { id: 0, x: 2600, y: 800, sprite: "Red.png", companion: {} },
        { id: 0, x: 2850, y: 450, sprite: "Red.png", companion: {} },
        { id: 0, x: 2450, y: 2300, sprite: "Red.png", companion: {} },
        { id: 0, x: 2700, y: 2100, sprite: "Red.png", companion: {} },
        { id: 0, x: 3100, y: 2100, sprite: "Red.png", companion: {} },
        { id: 0, x: 2800, y: 3650, sprite: "Red.png", companion: {} },
        { id: 0, x: 2150, y: 2550, sprite: "Red.png", companion: {} },
        { id: 0, x: 1000, y: 2250, sprite: "Red.png", companion: {} },
        { id: 0, x: 1000, y: 2600, sprite: "Red.png", companion: {} },
        { id: 0, x: 650, y: 2600, sprite: "Red.png", companion: {} },
        { id: 0, x: 300, y: 2250, sprite: "Red.png", companion: {} },
        { id: 0, x: 300, y: 2600, sprite: "Red.png", companion: {} },
        { id: 0, x: 300, y: 1850, sprite: "Red.png", companion: {} },
        { id: 0, x: 640, y: 1850, sprite: "Red.png", companion: {} },
        { id: 0, x: 1000, y: 1850, sprite: "Red.png", companion: {} },
    ]
    npcs.forEach((npc, index) => { npc.id = index })
    await npcsCollection.insertOne({ userId, npcs })
    // pokemonCollection.insertMany(pokemon);
};
export async function resetGame(userId: number) {
    await playerCollection.deleteOne({ userId });
    await npcsCollection.deleteMany({ userId });
    await pokemonCollection.deleteMany();
}
export async function saveGame(username: string, gameSave: any) {
    console.log("save");
    const updateData = getDotNotation(gameSave);
    // await gameCollection.updateOne({ username: username }, { $set: updateData })


    function getDotNotation(obj: any, prefix = "", result: any = {}) {
        for (const key in obj) {
            const value = obj[key];
            const path = prefix === "" ? key : `${prefix}.${key}`;
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                getDotNotation(value, path, result)
            }
            else {
                result[path] = value
            }
        }
        return result;
    }
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Vul alle velden in.");
    }
    else {
        const user = await getUser(username);
        if (user) {
            if (await bcrypt.compare(password, user.password!)) {
                return user;
            }
            else {
                throw new Error("Dit wachtwoord is niet correct.");
            }
        }
        else {
            throw new Error("Deze gebruiker is niet gevonden.");
        }
    }
}
export async function signup(username: string, email: string, password: string) {
    if (username === "" || email === "" || password === "") {
        throw new Error("Vul alle velden in.")
    }
    else {
        let user = await getUser(username);
        if (!user) {
            const saltRounds = 10;
            await createUser({ username, email, password: await bcrypt.hash(password, saltRounds) })
        }
        else {
            throw new Error("Deze gebruiker bestaat al.")
        }
    }
}

async function fetchPokemon() {
    const pokemonList: Pokemon[] = [];
    const pokeFetch1 = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
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
