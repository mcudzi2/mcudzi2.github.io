<template>
  <div class="space-y-6 w-full relative">
    <button
        type="button"
        class="absolute top-0 right-0 p-1 bg-transparent hover:!bg-neutral-800/50 rounded-sm flex flex-row items-center gap-x-2 z-10"
        @click="toggleShow"
    >
      <span>{{ show ? 'Hide' : 'Show' }}</span>
      <span :class="[show ? '' : 'rotate-180']">&#11165;</span>
    </button>
    <h3 class="text-center">
      Groups
    </h3>
    <template v-if="show">
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        <CompetitionGroup
            v-for="group in groupsStore.groups"
            :key="group"
            :group="group"
        />
      </div>
      <div
          v-if="competitionsStore.currentCompetition?.hasBestOfThirds"
          class="mx-auto px-0 w-full lg:w-1/2 lg:px-6 3xl:w-1/3"
      >
        <CompetitionGroup group="thirds" />
      </div>
      <div class="space-y-2 text-center w-80 mx-auto">
        <div class="flex flex-row items-center gap-x-2">
          <div class="h-4 w-4 bg-blue-400" />
          <p class="italic">Advances to Knockout Stage</p>
        </div>
        <div
            v-if="competitionsStore.currentCompetition?.hasBestOfThirds"
            class="flex flex-row items-center gap-x-2"
        >
          <div class="h-4 w-4 bg-orange-400" />
          <p class="italic">Can Advance via 3rd Place Placement</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import CompetitionGroup from "@/components/CompetitionGroup.vue";
import {useCompetitions} from "@/stores/competitions.js";
import {useGroups} from "@/stores/groups.js";
import {ref} from "vue";

const competitionsStore = useCompetitions();
const groupsStore = useGroups();

const show = ref(true);
function toggleShow() {
  show.value = !show.value;
}
</script>

<style scoped>

</style>