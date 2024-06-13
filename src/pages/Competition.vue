<template>
  <RouterView />
</template>

<script setup>
import { useTeams } from "@/stores/teams.js";
import { useRoute } from "vue-router";

const teamsStore = useTeams();
const route = useRoute();
teamsStore.initTeams(route.params.competition);
teamsStore.initMatches();
teamsStore.updateMatchStats();
</script>

<style scoped>

</style>