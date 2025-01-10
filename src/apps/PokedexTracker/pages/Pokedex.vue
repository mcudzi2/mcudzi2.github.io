<template>
  <div class="space-y-6">
    <div class="w-full max-h-[80vh] overflow-auto">
      <div class="pokedex-table grid grid-cols-12 min-w-[955px] relative">
        <div class="grid grid-cols-subgrid col-span-full sticky top-0 bg-neutral-50 dark:bg-neutral-800 z-20">
          <h5
            v-for="column in columns"
            :key="`header-${column.key}`"
            v-text="column.name"
            class="cell header-cell"
            :class="column.headerClasses"
          />
        </div>
        <template
          v-for="pokemon in pokemonList"
          :key="pokemon.id"
        >
          <div
            v-for="column in columns"
            :key="`row-${pokemon.id}-${column.key}`"
            class="cell body-cell flex flex-col"
            :class="column.rowClasses"
          >
            <template v-if="column.key !== 'name'">
              <div
                v-for="(number, pokedex) in pokemon[column.key]"
                :key="`row-${pokemon.id}-${column.key}-${pokedex}`"
                class="flex flex-row items-center gap-x-1 sm:gap-x-1.5"
                :class="{ 'cursor-pointer': number.value }"
                @click="number.value && toggleEntry(pokemon.id, column.key, pokedex)"
              >
                <span v-tippy="pokedexes[pokedex]">
                  {{ number.value || '-' }}
                </span>
                <div
                  class="h-4 w-4 rounded-full bg-transparent border border-transparent"
                  :class="{ 'drop-shadow !border-neutral-300 dark:border-neutral-700 bg-gradient-to-b from-red-700 from-50% to-white to-50%': number.completed}"
                />
              </div>
            </template>
            <p
              v-else
              v-text="pokemon[column.key]"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-row items-center justify-center gap-x-6">
      <button
          v-if="!cannotLoadMore"
          class="bg-red-800 text-neutral-50 hover:opacity-75 cursor-pointer rounded-md px-6 py-3 text-lg"
          @click="loadMore(false)"
      >
        Load {{ batchSize }} More
      </button>
      <button
          v-if="!cannotLoadMore"
          class="bg-neutral-600 text-neutral-50 hover:opacity-75 cursor-pointer rounded-md px-6 py-3 text-lg"
          @click="clearCompletion"
      >
        Clear Capture Data
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PokemonApi from "@/services/apis/PokemonApi.js";
import { toTitleCase } from "@/services/Utils.js";

const columns = [
  { key: 'national', name: "#", headerClasses: "text-right sticky -left-5 sm:-left-3", rowClasses: "items-end sticky -left-5 sm:-left-3" },
  { key: 'name', name: "Name", headerClasses: "col-span-2 sticky left-14 sm:left-16", rowClasses: "col-span-2 font-medium sticky left-14 sm:left-16" },
  { key: 'kanto', name: "Kanto", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'johto', name: "Johto", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'hoenn', name: "Hoenn", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'sinnoh', name: "Sinnoh", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'unova', name: "Unova", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'kalos', name: "Kalos", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'alola', name: "Alola", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'galar', name: "Galar", headerClasses: "text-center", rowClasses: "items-center" },
  { key: 'paldea', name: "Paldea", headerClasses: "text-center", rowClasses: "items-center" },
];

const pokedexes = ref({});
const species = ref([]);
const pokemonList = ref([]);
const completionData = ref(JSON.parse(window.localStorage.getItem('mcudzi2:pokedex-tracker:completion') || '{}'));

function getNumberForPokedex(pokemonObj, pokedex) {
  if (!Array.isArray(pokedex)) {
    const pokedexEntry = pokemonObj.pokedex_numbers.find(entry => entry.pokedex.name === pokedex);
    return {
      [pokedex]: {
        value: (pokedexEntry ? pokedexEntry.entry_number : 0),
        completed: !!pokedexEntry && !!completionData.value?.[pokemonObj.id]?.[pokedex],
      } };
  } else {
    const pokedexEntries = pokemonObj.pokedex_numbers.filter(entry => pokedex.includes(entry.pokedex.name));
    return pokedexEntries.length
        ? pokedexEntries.reduce((obj, entry) => ({
          ...obj,
          [entry.pokedex.name]: {
            value: entry.entry_number,
            completed: !!completionData.value?.[pokemonObj.id]?.[entry.pokedex.name],
          },
        }), {})
        : { [pokedex[0]]: { value: 0, completed: false } };
  }
}

function getValueForLanguage(obj, language, key) {
  const groupKey = `${key}s`;
  const nameEntry = obj[groupKey].find(entry => entry.language.name === language);
  return nameEntry ? nameEntry[key] : null;
}

const batchSize = 100;
const cannotLoadMore = computed(() => pokemonList.value?.length >= species.value?.length);
function loadMore(loadAll = false) {
  if (cannotLoadMore.value) {
    return;
  }

  const requests = [];
  const chunkSize = loadAll ? 10000 : batchSize;
  for (let i = pokemonList.value.length; i < pokemonList.value.length + chunkSize && i < species.value.length; i++) {
    const url = species.value[i].url;
    const uri = url.substring(url.indexOf('pokemon-species'));
    requests.push(PokemonApi.get(uri));
  }

  Promise.all(requests)
      .then(responses => {
        responses.forEach(response => pokemonList.value.push({
          id: response.id,
          national: getNumberForPokedex(response, 'national'),
          name: getValueForLanguage(response, 'en', 'name'),
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

function saveCompletion(id, pokedex, value) {
  if (completionData.value[id] === undefined) {
    completionData.value[id] = {};
  }
  completionData.value[id][pokedex] = value;
  window.localStorage.setItem('mcudzi2:pokedex-tracker:completion', JSON.stringify(completionData.value));
}

function toggleEntry(id, region, pokedex) {
  const index = pokemonList.value.findIndex(pokemon => pokemon.id === id);
  if (index < 0) {
    return;
  }

  const currentValue = !!pokemonList.value[index][region][pokedex].completed;
  pokemonList.value[index][region][pokedex].completed = !currentValue;
  saveCompletion(id, pokedex, !currentValue);
}

function clearCompletion() {
  if (confirm("Clearing Pokedex Completion - this will overwrite your saved data. This CANNOT be undone. Are you sure?")) {
    completionData.value = {};
    pokemonList.value.forEach(pokemon => {
      Object.keys(pokemon).forEach(key => {
        if (['id', 'name'].includes(key)) {
          return;
        }
        Object.keys(pokemon[key]).forEach(pokedex => {
          pokemon[key][pokedex].completed = false;
        })
      })
    })
    window.localStorage.removeItem('mcudzi2:pokedex-tracker:completion');
  }
}

onMounted(() => {
  const noLimitParams = {
    limit: 10000,
    offset: 0,
  };
  PokemonApi.get('pokemon-species', { params: noLimitParams })
    .then(response => {
      species.value = response.results;
      loadMore(false);
    });
  PokemonApi.get('pokedex', { params: noLimitParams })
    .then(response => {
      const requests = response.results.map(pokedex => {
        const uri = pokedex.url.substring(pokedex.url.indexOf('pokedex'));
        return PokemonApi.get(uri);
      })

      Promise.all(requests)
        .then(responses => {
          pokedexes.value = responses.reduce((pokedexMap, pokedex) => {
            const pokedexDesc = getValueForLanguage(pokedex, 'en', 'description');
            const pokedexName = getValueForLanguage(pokedex, 'en', 'name');
            let extendedDescIndex = pokedexDesc?.indexOf('—');
            if (extendedDescIndex < 0) {
              extendedDescIndex = pokedexDesc?.indexOf('-');
            }
            return {
              ...pokedexMap,
              [pokedex.name]: (extendedDescIndex > 0 ? pokedexDesc.substring(0, extendedDescIndex) : pokedexDesc)
                || (pokedexName ? `${pokedexName} dex` : '')
                || toTitleCase(pokedex.name) + ' dex',
            };
          }, {});
          console.log(pokedexes.value);
        });
    })
});
</script>

<style scoped lang="scss">
.pokedex-table {
  .cell {
    @apply p-1 sm:py-3 sm:px-2;

    &.sticky {
      @apply bg-neutral-50 dark:bg-neutral-800 z-10;
    }
  }

  .header-cell {
    @apply border-b-2 border-slate-400/50 text-base sm:text-xl;
  }

  .body-cell {
    @apply border-b border-slate-400/50 text-sm sm:text-base;
  }
}
</style>