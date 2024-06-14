<template>
  <div class="space-y-6 w-full">
    <CompetitionPageTitle
      :name="competitionsStore.currentCompetition?.name"
      :image-url="competitionsStore.currentCompetition?.image"
      stage="group"
      class="sticky top-0 z-20"
    />
    <CompetitionGroups />
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
    <div class="w-full text-center space-y-2">
      <button
          type="button"
          class="bg-lime-600/70 hover:!bg-lime-700/70 py-4 px-12 border border-neutral-500 rounded-xl mx-auto text-2xl"
          @click="goToKnockout"
      >
        Save and Go to Knockout
      </button>
    </div>
  </div>
</template>

<script setup>
import {useCompetitions} from "@/stores/competitions.js";
import CompetitionPageTitle from "@/components/CompetitionPageTitle.vue";
import {useGroups} from "@/stores/groups.js";
import CompetitionGroups from "@/components/CompetitionGroups.vue";
import CompetitionGroupMatch from "@/components/CompetitionGroupMatch.vue";
import {useRouter} from "vue-router";

const competitionsStore = useCompetitions();
const groupsStore = useGroups();

const router = useRouter();
function goToKnockout() {
  groupsStore.save();
  router.push({name: 'knockout-stage'});
}
</script>