<template>
  <tr>
    <td v-text="position"/>
    <td class="!text-left !w-52 flex flex-row items-center">
      <div class="w-10">{{ team.abbr }}</div>
      <div class="font-normal">| {{ team.name }}</div>
    </td>
    <td v-text="team.wins"/>
    <td v-text="team.draws"/>
    <td v-text="team.losses"/>
    <td v-text="team.goalsFor"/>
    <td v-text="team.goalsAgainst"/>
    <td v-text="goalDifference" />
    <td v-text="points" />
  </tr>
</template>

<script setup>
import { useTeams } from "@/stores/teams.js";
import {computed} from "vue";

const teamsStore = useTeams();
const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
  position: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value > 0,
  },
});

const goalDifference = computed(() => teamsStore.calculateGoalDiff(props.team));
const points = computed(() => teamsStore.calculatePoints(props.team));
</script>

<style scoped>

</style>