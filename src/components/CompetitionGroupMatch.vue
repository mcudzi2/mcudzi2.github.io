<template>
  <div
    class="w-full rounded-xl py-2 px-6 flex flex-row items-center gap-x-4"
    :class="[index % 2 ? 'bg-lime-600/70' : 'bg-lime-700/70']"
  >
    <CompetitionGroupMatchTeam
      :team="match.team1"
      class="flex-1"
    />
    <input
      v-model="match.team1Score"
      type="number"
      min="0"
      @input="teamsStore.updateMatchStats()"
    />
    <input
      v-model="match.team2Score"
      type="number"
      min="0"
      @input="teamsStore.updateMatchStats()"
    />
    <CompetitionGroupMatchTeam
      :team="match.team2"
      flipped
      class="flex-1"
    />
  </div>
</template>

<script setup>
import CompetitionGroupMatchTeam from "@/components/CompetitionGroupMatchTeam.vue";
import {useTeams} from "@/stores/teams.js";

const teamsStore = useTeams();
defineProps({
  match: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value >= 0,
  },
});
</script>

<style scoped lang="scss">
input {
  @apply bg-neutral-100 w-10 md:w-12 p-1 font-bold text-center text-xl md:text-3xl rounded-xl;
  @apply text-neutral-700 #{!important};
}
</style>