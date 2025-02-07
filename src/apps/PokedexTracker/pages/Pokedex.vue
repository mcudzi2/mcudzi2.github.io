<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-row items-center justify-center gap-x-6">
      <InputSearch
        class="max-w-full w-96"
        @search="searchBy = $event"
      />
      <ActionButton
        text="Table Settings"
        type="secondary"
        :disabled="loading"
        @click="showTableSettings = true"
      />
    </div>
    <DataTable
      v-model:sort-by="sortBy"
      :headers="columns"
      :items="pokemonList"
      :row-classes="tableRowClasses"
      fix-headers
      :search-term="searchBy"
      search-fields="name"
      :table-style="tableStyles"
      use-virtual-scroll
      :row-height="rowHeight"
      :padding-item-count="10"
      class="w-full h-[75vh] overflow-auto"
    >
      <template
        v-for="pokedexColumn in pokedexColumns"
        :key="pokedexColumn.value"
        #[`item-${pokedexColumn.value}`]="item"
      >
        <template
          v-for="(number, pokedex) in item[pokedexColumn.value]"
          :key="`row-${item.id}-${pokedex}`"
        >
          <div
            v-if="tableSettings.pokedexes[pokedex] || pokedex === 'national'"
            class="flex flex-row items-center gap-x-1 sm:gap-x-1.5"
            :class="{ 'cursor-pointer': number }"
            @click="number && toggleEntry(pokedexColumn.value, pokedex, number)"
          >
            <span v-tippy="number ? pokedexes[pokedex]?.name : null">
              {{ number || '-' }}
            </span>
            <div
              class="h-4 w-4 rounded-full bg-transparent border border-transparent"
              :class="{ 'drop-shadow !border-neutral-300 dark:border-neutral-700 bg-gradient-to-b from-red-700 from-50% to-white to-50%': completionData[pokedexColumn.value]?.[pokedex]?.[number] }"
            />
          </div>
        </template>
      </template>
    </DataTable>
    <div class="flex flex-row items-center justify-center gap-x-6">
      <ActionButton
          v-if="!cannotLoadMore"
          size="lg"
          :disabled="loading"
          @click="loadMore(false)"
      >
        Load {{ batchSize }} More
      </ActionButton>
    </div>
    <div class="flex flex-row items-center justify-center gap-x-6">
      <ActionButton
          type="secondary"
          text="View Capture Summary"
          @click="showCaptureSummary = true"
      />
      <ActionButton
          type="secondary"
          text="Clear Capture Data"
          @click="clearCompletion"
      />
    </div>
    <TableSettings
      v-model:show="showTableSettings"
      v-model:settings="tableSettings"
      :regions="regions"
      :pokedexes="pokedexes"
      @update="saveSettings"
    />
    <CaptureSummary
      v-model:show="showCaptureSummary"
      :settings="tableSettings"
      :completion-data="completionData"
      :pokedexes="pokedexes"
      :completed-pokemon="completedPokemon"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import PokemonApi from "@/services/apis/PokemonApi.js";
import { toTitleCase } from "@/services/Utils.js";
import InputSearch from "@/components/InputSearch.vue";
import TableSettings from "../components/TableSettings.vue";
import ActionButton from "@/components/ActionButton.vue";
import DataTable from "@/components/DataTable.vue";
import CaptureSummary from "@/apps/PokedexTracker/components/CaptureSummary.vue";

const loading = ref(false);

const regions = ref([]);
function initRegions(params = {}) {
  return PokemonApi.get('region', { params })
    .then(response => {
      const requests = response.results.map(region => {
        const uri = region.url.substring(region.url.indexOf('region'));
        return PokemonApi.get(uri);
      });

      Promise.all(requests)
        .then(responses => {
          regions.value = responses.map(region => ({
            key: region.name,
            name: getValueForLanguage(region, 'en', 'name'),
            pokedexes: region.pokedexes.map(pokedex => pokedex.name) || [],
          }));
        });
    });
}

const columns = computed(() => {
  const baseColumns = [
    {
      value: 'national',
      name: "#",
      headerContentClasses: "justify-end sticky -left-5 sm:-left-3",
      rowContentClasses: "items-end sticky -left-5 sm:-left-3",
      pokedexes: ['national'],
      sortBy: 'national.national',
    },
    {
      value: 'name',
      name: "Name",
      headerContentClasses: "sticky left-14 sm:left-16",
      rowContentClasses: "font-medium sticky left-14 sm:left-16",
    },
  ];
  const regionColumns = regions.value?.map(region => ({
    value: region.key,
    name: region.name,
    headerContentClasses: "justify-center",
    rowContentClasses: "items-center",
    pokedexes: region.pokedexes,
    sortBy: region.pokedexes
      .filter(pokedex => !!tableSettings.value?.pokedexes?.[pokedex])
      .map(pokedex => `${region.key}.${pokedex}`),
  })).filter(region => region.pokedexes.some(pokedex => !!tableSettings.value?.pokedexes?.[pokedex])) || [];
  return baseColumns.concat(regionColumns);
});
const pokedexColumns = computed(() => columns.value.filter(column => column.pokedexes?.length > 0));

const tableStyles = computed(() => ({
  minWidth: (columns.value.length * 115) + 'px',
}));

const showTableSettings = ref(false);
const defaultPokedexes = [
  'kanto',
  'original-johto',
  'hoenn',
  'extended-sinnoh',
  'original-unova',
  'kalos-central',
  'kalos-coastal',
  'kalos-mountain',
  'updated-alola',
  'galar',
  'isle-of-armor',
  'crown-tundra',
  'hisui',
  'paldea',
  'kitakami',
  'blueberry',
];
const tableSettings = ref(JSON.parse(window.localStorage.getItem('mcudzi2:pokedex-tracker:settings') || 'null') || {
  pokedexes: {},
});

function saveSettings() {
  window.localStorage.setItem('mcudzi2:pokedex-tracker:settings', JSON.stringify(tableSettings.value));
}

const searchBy = ref('');
const sortBy = reactive({
  header: '',
  key: '',
  dir: 'asc',
});

const pokedexes = ref({});
function initPokedexMetadata(params = {}) {
  PokemonApi.get('pokedex', { params })
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
            const name = (extendedDescIndex > 0 ? pokedexDesc.substring(0, extendedDescIndex) : pokedexDesc)
                || (pokedexName ? `${pokedexName} dex` : '')
                || toTitleCase(pokedex.name) + ' dex';
            return {
              ...pokedexMap,
              [pokedex.name]: {
                name,
                count: pokedex.pokemon_entries?.length || 0,
              },
            };
          }, {});
          Object.keys(pokedexes.value).forEach(pokedexName => {
            if (!Object.keys(tableSettings.value.pokedexes).includes(pokedexName)) {
              tableSettings.value.pokedexes[pokedexName] = defaultPokedexes.includes(pokedexName);
            }
          });
          saveSettings();
        });
    })
}

const species = ref([]);
const pokemonList = ref([]);
function initPokemon(params = {}) {
  PokemonApi.get('pokemon-species', { params })
      .then(response => {
        species.value = response.results;
        loadMore(false);
      });
}

const batchSize = 100;
const cannotLoadMore = computed(() => pokemonList.value?.length >= species.value?.length);
function loadMore(loadAll = false) {
  if (cannotLoadMore.value || loading.value) {
    return;
  }

  loading.value = true;
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
        national: {
          national: getNumberForPokedex(response, 'national'),
        },
        name: getValueForLanguage(response, 'en', 'name'),
        ...regions.value.reduce((regionMap, region) => ({
          ...regionMap,
          [region.key]: region.pokedexes.reduce((regionalPokedexMap, regionalPokedex) => ({
            ...regionalPokedexMap,
            [regionalPokedex]: getNumberForPokedex(response, regionalPokedex),
          }), {}),
        }), {}),
      }));
    })
    .finally(() => {
      loading.value = false;
      isPokemonCaughtInAllPokedexes(pokemonList.value[0]);
    });
}

function getNumberForPokedex(pokemonObj, pokedex) {
    return pokemonObj.pokedex_numbers.find(entry => entry.pokedex.name === pokedex)?.entry_number || null;
}

function getValueForLanguage(obj, language, key) {
  const groupKey = `${key}s`;
  const nameEntry = obj[groupKey].find(entry => entry.language.name === language);
  return nameEntry ? nameEntry[key] : null;
}

const completionData = ref(JSON.parse(window.localStorage.getItem('mcudzi2:pokedex-tracker:completion') || '{}'));
function toggleEntry(region, pokedex, number) {
  if (completionData.value[region] === undefined) {
    completionData.value[region] = {};
  }
  if (completionData.value[region][pokedex] === undefined) {
    completionData.value[region][pokedex] = {};
  }
  const currentValue = !!completionData.value[region][pokedex][number];
  completionData.value[region][pokedex][number] = !currentValue;
  saveCompletion();
}

function saveCompletion() {
  window.localStorage.setItem('mcudzi2:pokedex-tracker:completion', JSON.stringify(completionData.value));
}

function clearCompletion() {
  if (confirm("Clearing Pokedex Completion - this will overwrite your saved data. This CANNOT be undone. Are you sure?")) {
    completionData.value = {};
    window.localStorage.removeItem('mcudzi2:pokedex-tracker:completion');
  }
}

const showCaptureSummary = ref(false);
function isPokemonCaughtInAllPokedexes(item) {
  return !!completionData.value.national?.national?.[item.national.national]
    && regions.value.every(region => {
      return region.pokedexes.every(pokedexKey => {
        const regionalPokedexNumber = item?.[region.key]?.[pokedexKey] || 0;
        return !tableSettings.value.pokedexes?.[pokedexKey]
          || !regionalPokedexNumber
          || !!completionData.value?.[region.key]?.[pokedexKey]?.[regionalPokedexNumber];
      })
    });
}
function tableRowClasses(item) {
  return { 'bg-amber-500/10': isPokemonCaughtInAllPokedexes(item) };
}
const rowHeight = computed(() => {
  const maxPokedexPerRegionCount = pokedexColumns.value.reduce((maxCount, column) => {
    const pokedexesInColumn = column.pokedexes.filter(pokedex => !!tableSettings?.value?.pokedexes?.[pokedex]);
    return Math.max(maxCount, pokedexesInColumn.length);
  }, 0);
  return 49 + (24 * Math.max(1, maxPokedexPerRegionCount));
})

const completedPokemon = computed(() => pokemonList.value.filter(pokemon => isPokemonCaughtInAllPokedexes(pokemon)));

onMounted(() => {
  const noLimitParams = {
    limit: 10000,
    offset: 0,
  };
  initRegions(noLimitParams).finally(() => {
    initPokemon(noLimitParams);
  });
  initPokedexMetadata(noLimitParams);
});
</script>