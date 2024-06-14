<template>
  <div class="space-y-6 w-full">
    <CompetitionPageTitle
        :name="competitionsStore.currentCompetition?.name"
        :image-url="competitionsStore.currentCompetition?.image"
        :stage="route.name"
        class="sticky top-0 z-20"
    />
    <CompetitionGroups />
    <hr/>
    <RouterView />
  </div>
</template>

<script setup>
import { useGroups } from "@/stores/groups.js";
import { useRoute } from "vue-router";
import CompetitionPageTitle from "@/components/CompetitionPageTitle.vue";
import CompetitionGroupMatch from "@/components/CompetitionGroupMatch.vue";
import CompetitionGroups from "@/components/CompetitionGroups.vue";
import {useCompetitions} from "@/stores/competitions.js";

const competitionsStore = useCompetitions();
const groupsStore = useGroups();
const route = useRoute();
groupsStore.initTeams(route.params.competition);
groupsStore.initMatches();
groupsStore.updateMatchStats();
</script>

<style scoped>

</style>