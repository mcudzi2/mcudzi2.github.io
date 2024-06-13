<template>
  <div class="mt-12 md:mt-24 xl:mt-48 w-full flex flex-col justify-center text-center gap-y-8">
    <h1>Continental Cup Bracket Creation</h1>
    <p class="italic">Please pick a competition</p>
    <div class="flex flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6">
      <CompetitionTile
        v-for="competition in competitionsStore.competitions"
        :key="competition.link"
        :image-url="competition.image"
        :link="competition.link"
        :name="competition.name"
      />
    </div>
    <h2>Scoring Guidelines</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-3">
        <h4 class="underline">Group Stage</h4>
        <ul>
          <li>+1 point for each correct match result (W/D/L)</li>
          <li>+1 point for each correct group placement (1st, 2nd, 3rd, 4th)</li>
        </ul>
      </div>
      <div class="space-y-3">
        <h4 class="underline">Knockout Stage</h4>
        <ul>
          <li>+1 points for each correct team in Round of 16</li>
          <li>+1 points for each correct team in Quarterfinals</li>
          <li>+2 points for each correct team in SemiFinals</li>
          <li>+3 points for each correct team in Finals</li>
          <li>+5 points for correct Champion</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import CompetitionTile from "@/components/CompetitionTile.vue";
import {useCompetitions} from "@/stores/competitions.js";

const competitionsStore = useCompetitions();
</script>