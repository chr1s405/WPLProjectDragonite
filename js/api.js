export async function GetPokemon() {
  const pokemonList = [];
  fetch("https://pokeapi.co/api/v2/pokemon?limit=50&offset=0")
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      const pokemonData = result["results"];
      return pokemonData;
    })
    .then((result) => {
      return Promise.all(result.map((result) => fetch(result.url)));
    })
    .then((result) => {
      return Promise.all(result.map((value) => value.json()));
    })
    .then((result) => {
      result.forEach((pokemon) => {
        pokemonList.push({
          abilities: pokemon.abilities,
          base_experience: pokemon.base_experience,
          cries: pokemon.cries,
          forms: pokemon.forms,
          //game_indices: pokemon.game_indices,
          //height: pokemon.height,
          held_items: pokemon.held_items,
          id: pokemon.id,
          is_default: pokemon.is_default,
          //location_area_encount: pokemon.location_area_encount,
          moves: pokemon.moves,
          name: pokemon.name,
          order: pokemon.order,
          past_abilities: pokemon.past_abilities,
          past_types: pokemon.past_types,
          species: pokemon.species,
          sprites: pokemon.sprites,
          other: pokemon.other,
          versions: pokemon.versions,
          stats: pokemon.stats,
          types: pokemon.types,
          //weight: pokemon.weight,
        });
      });
    });
}
