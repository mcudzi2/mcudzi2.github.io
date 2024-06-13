<template>
  <div class="space-y-6 w-full">
    <CompetitionPageTitle
      :name="currentCompetition.name"
      :image-url="currentCompetition.image"
      stage="group"
      class="sticky top-0"
    />
    <h3 class="text-center">
      Groups
    </h3>
    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      <CompetitionGroup
        v-for="group in teamsStore.groups"
        :key="group"
        :group="group"
      />
    </div>
    <div class="mx-auto px-0 w-full lg:w-1/2 lg:px-6 3xl:w-1/3">
      <CompetitionGroup group="thirds" />
    </div>
    <hr/>
    <h3 class="text-center">
      Matches
    </h3>
    <div class="space-y-3 my-0 mx-auto w-full md:w-[45rem] lg:w-[50rem]">
      <CompetitionGroupMatch
        v-for="(match, idx) in teamsStore.matches"
        :key="match.team1.abbr + match.team2.abbr"
        :match="match"
        :index="idx"
      />
    </div>
  </div>
</template>

<script setup>
import {useCompetitions} from "@/stores/competitions.js";
import {useRoute} from "vue-router";
import {computed} from "vue";
import CompetitionPageTitle from "@/components/CompetitionPageTitle.vue";
import CompetitionGroup from "@/components/CompetitionGroup.vue";
import {useTeams} from "@/stores/teams.js";
import CompetitionGroupMatch from "@/components/CompetitionGroupMatch.vue";

const route = useRoute();
const competitionsStore = useCompetitions();
const teamsStore = useTeams();
const currentCompetition = computed(() =>
  competitionsStore.competitions.find(competition => competition.link === route.params.competition)
);
</script>