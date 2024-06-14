<template>
  <div class="w-full overflow-x-hidden relative">
    <div
        v-if="!disablePrevCol"
        class="nav-button left-1 -rotate-90"
        @click="prevCol"
    >
      <div class="text-sm !text-white">&#11165;</div>
    </div>
    <div
        v-if="!disableNextCol"
        class="nav-button right-1 rotate-90"
        @click="nextCol"
    >
      <div class="text-sm !text-white">&#11165;</div>
    </div>
    <div
        class="grid gap-1"
        :class="columnsClass"
        :style="bracketStyles"
    >
      <div
          v-for="round in rounds"
          class="bg-neutral-300 !text-neutral-700 rounded-lg text-center font-medium py-1"
          v-text="round.title"
      />
      <template v-for="(round, idx) in rounds">
        <div class="flex flex-col gap-y-12 justify-around">
          <div
              v-for="i in Math.ceil(round.teams/4)"
              class="rounded-lg bg-lime-600/70"
              :class="[round.slug === 'finals' ? 'h-10' : 'h-20']"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {useCompetitions} from "@/stores/competitions.js";
import {useTailwindBreakpoints} from "@/composables/useTailwindBreakpoints.js";

const {getValueForCurrentBreakpoint} = useTailwindBreakpoints();

const roundConfig = {
  'round-of-16': {
    teams: 16,
    title: 'Round of 16',
  },
  quarterfinals: {
    teams: 8,
    title: 'Quarterfinals',
  },
  semifinals: {
    teams: 4,
    title: 'Semifinals',
  },
  finals: {
    teams: 2,
    title: 'Final',
  },
};

const competitionsStore = useCompetitions();
const rounds = computed(() => {
  const allRounds = Object.keys(roundConfig);
  const sliceIdx = allRounds.findIndex(round => round === competitionsStore.currentCompetition?.knockoutStart);
  return sliceIdx >= 0
      ? allRounds.slice(sliceIdx).concat(allRounds.slice(sliceIdx).reverse()).map(round => ({...roundConfig[round], slug: round}))
      : [{ teams: 0, title: 'Round 1' }];
});

//grid-cols-1
//grid-cols-2
//grid-cols-4
//grid-cols-6
//grid-cols-8
//grid-cols-10
//grid-cols-12
const columnsClass = computed(() => `grid-cols-${rounds.value.length}`);
const numColumnsPerBreakpoint = {
  mobile: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
};
const startCol = ref(0);
const bracketStyles = computed(() => ({
  width: `calc(${rounds.value.length} * ${100/getValueForCurrentBreakpoint(numColumnsPerBreakpoint)}%)`,
  transform: `translateX(-${(100*startCol.value)/rounds.value.length}%)`
}));

const disableNextCol = computed(() => startCol.value + getValueForCurrentBreakpoint(numColumnsPerBreakpoint) >= rounds.value.length);
const disablePrevCol = computed(() => startCol.value <= 0);
function nextCol() {
  if (disableNextCol.value) {
    return;
  }
  startCol.value++;
}
function prevCol() {
  if (disablePrevCol.value) {
    return;
  }
  startCol.value--;
}
</script>

<style scoped>
.nav-button {
  @apply h-7 w-7 rounded-full bg-neutral-700 active:bg-neutral-600 opacity-60 hover:opacity-100 cursor-pointer;
  @apply absolute top-0.5 z-10 flex flex-row items-center justify-center;
}
</style>