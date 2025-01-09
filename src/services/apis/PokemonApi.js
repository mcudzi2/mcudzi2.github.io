import Api from '../Api.js';

class PokemonApi extends Api {
    baseUrl = 'https://pokeapi.co/api/v2/';
}

export default new PokemonApi();