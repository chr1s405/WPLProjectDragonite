let pokemon;
fetch("https://pokeapi.co/api/v2/pokemon?limit=50&offset=0")
    .then((result)=>{
        return result.json();
    })
    .then((result)=>{
        pokemon = result["results"];
        for(let i = 0; i < pokemon.length; i++){
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon[i]["name"]}`)
            .then((result)=>{
                return result.json();
            })
            .then((result)=>{
                pokemon[i] = result;
            })
            .catch((error)=>{
                console.log("error");
            })
        }
        console.log(pokemon);
    })
    .catch((error)=>{
        console.log("error");
    })

    // abilities
    // base_experience
    // cries
    // forms
    // game_indices
    // height
    // held_items
    // id
    // is_default
    // location_area_encounters
    // moves
    // name
    // order
    // past_abilities
    // past_types
    // species
    // sprites
    // other
    // versions
    // stats
    // types
    // weight