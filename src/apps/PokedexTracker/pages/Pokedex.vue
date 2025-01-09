<template>
  <div class="space-y-6">
    <div class="w-full overflow-x-auto">
      <div class="pokedex-table grid grid-cols-12 min-w-[955px]">
        <h5
            v-for="column in columns"
            :key="`header-${column.key}`"
            v-text="column.name"
            :class="column.headerClasses"
        />
        <template
            v-for="p in pokemon"
            :key="p.id"
        >
          <p
              v-for="column in columns"
              :key="`row-${p.id}-${column.key}`"
              :class="column.rowClasses"
              v-html="p[column.key]"
          />
        </template>
      </div>
    </div>
    <div class="flex flex-row items-center justify-center">
      <button
          v-if="!cannotLoadMore"
          class="bg-red-800 text-neutral-50 hover:opacity-75 cursor-pointer rounded-md px-6 py-3 text-lg"
          @click="loadMore"
      >
        Load {{ batchSize }} More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PokemonApi from "@/services/apis/PokemonApi.js";

const columns = [
  { key: 'national', name: "#", headerClasses: "text-right", rowClasses: "text-right" },
  { key: 'name', name: "Name", headerClasses: "col-span-2", rowClasses: "col-span-2 font-medium" },
  { key: 'kanto', name: "Kanto", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'johto', name: "Johto", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'hoenn', name: "Hoenn", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'sinnoh', name: "Sinnoh", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'unova', name: "Unova", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'kalos', name: "Kalos", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'alola', name: "Alola", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'galar', name: "Galar", headerClasses: "text-center", rowClasses: "text-center" },
  { key: 'paldea', name: "Paldea", headerClasses: "text-center", rowClasses: "text-center" },
];

const species = ref([]);
const pokemon = ref([]);

const params = {
  limit: 10000,
  offset: 0,
};
PokemonApi.get('pokemon-species', { params })
  .then(response => {
    species.value = response.results;
    loadMore();
  });

function getNumberForPokedex(pokemonObj, pokedex) {
  if (!Array.isArray(pokedex)) {
    const pokedexEntry = pokemonObj.pokedex_numbers.find(entry => entry.pokedex.name === pokedex);
    return pokedexEntry
        ? pokedexEntry.entry_number
        : '-';
  } else {
    const pokedexEntries = pokemonObj.pokedex_numbers.filter(entry => pokedex.includes(entry.pokedex.name));
    return pokedexEntries.length
        ? pokedexEntries.map(entry => `<span title="${entry.pokedex.name}">${entry.entry_number}</span>`).join('<br/>')
        : '-';
  }

}

function getNameForLanguage(pokemonObj, language = 'en') {
  const nameEntry = pokemonObj.names.find(entry => entry.language.name === language);
  return nameEntry ? nameEntry.name : pokemonObj.name;
}

const batchSize = 25;
const cannotLoadMore = computed(() => pokemon.value?.length >= species.value?.length);
function loadMore() {
  if (cannotLoadMore.value) {
    return;
  }

  const requests = [];
  for (let i = pokemon.value.length; i < pokemon.value.length + batchSize && i < species.value.length; i++) {
    const url = species.value[i].url;
    const uri = url.substring(url.indexOf('pokemon-species'));
    requests.push(PokemonApi.get(uri));
  }

  Promise.all(requests)
      .then(responses => {
        responses.forEach(response => pokemon.value.push({
          national: getNumberForPokedex(response, 'national'),
          name: getNameForLanguage(response),
          kanto: getNumberForPokedex(response, 'kanto'),
          johto: getNumberForPokedex(response, 'original-johto'),
          hoenn: getNumberForPokedex(response, 'hoenn'),
          sinnoh: getNumberForPokedex(response, 'extended-sinnoh'),
          unova: getNumberForPokedex(response, 'original-unova'),
          kalos: getNumberForPokedex(response, ['kalos-central', 'kalos-coastal', 'kalos-mountain']),
          alola: getNumberForPokedex(response, 'updated-alola'),
          galar: getNumberForPokedex(response, ['galar', 'isle-of-armor', 'crown-tundra']),
          paldea: getNumberForPokedex(response, ['paldea', 'kitakami', 'blueberry']),
        }));
      });
}
</script>

<style scoped lang="scss">
.pokedex-table {
  > h5, > p {
    @apply py-3 px-2;
  }

  > h5 {
    @apply border-b-2 border-slate-400/50
  }

  > p {
    @apply border-b border-slate-400/50;
  }
}
</style>