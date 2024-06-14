<template>
  <div class="space-y-6 w-full">
    <CompetitionPageTitle
        :name="competitionsStore.currentCompetition?.name"
        :image-url="competitionsStore.currentCompetition?.image"
        stage="knockout"
        class="sticky top-0"
    />
    <CompetitionGroups />
    <hr/>
    <h3 class="text-center">
      Knockout Bracket
    </h3>
    <p class="italics text-center">Enter scores for the matches below. The bracket will automatically complete based on results.</p>
    <div class="w-full text-center space-y-2">
      <button
          type="button"
          class="bg-lime-600/70 hover:!bg-lime-700/70 py-4 px-12 border border-neutral-500 rounded-xl mx-auto text-2xl"
          @click="returnToGroupStage"
      >
        Return to Group Stage
      </button>
      <p class="italic !text-red-600 font-medium">WARNING: Your bracket predictions will be cleared if you change group stage results.</p>
    </div>
  </div>
</template>

<script setup>
import {useCompetitions} from "@/stores/competitions.js";
import CompetitionPageTitle from "@/components/CompetitionPageTitle.vue";
import CompetitionGroups from "@/components/CompetitionGroups.vue";
import {useRouter} from "vue-router";

const competitionsStore = useCompetitions();

const router = useRouter();
function returnToGroupStage() {
  router.push({name: 'group-stage'});
}
</script>