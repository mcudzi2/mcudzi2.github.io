<template>
  <div class="space-y-6 w-full">
    <CompetitionPageTitle
      :name="competitionsStore.currentCompetition?.name"
      :image-url="competitionsStore.currentCompetition?.image"
      stage="group"
      class="sticky top-0"
    />
    <h3 class="text-center">
      Groups
    </h3>
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
    <hr/>
    <h3 class="text-center">
      Matches
    </h3>
    <p class="italics text-center">Enter scores for the matches below. Your group standings will be calculated above as you enter scores.</p>
    <div class="my-0 mx-auto w-full grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
      <CompetitionGroupMatch
        v-for="(match, idx) in groupsStore.matches"
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
import {useGroups} from "@/stores/groups.js";
import CompetitionGroupMatch from "@/components/CompetitionGroupMatch.vue";

const route = useRoute();
const competitionsStore = useCompetitions();
const groupsStore = useGroups();
</script>