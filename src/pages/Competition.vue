<template>
  <RouterView />
</template>

<script setup>
import { useGroups } from "@/stores/groups.js";
import { useRoute } from "vue-router";

const groupsStore = useGroups();
const route = useRoute();
groupsStore.initTeams(route.params.competition);
groupsStore.initMatches();
groupsStore.updateMatchStats();
</script>

<style scoped>

</style>