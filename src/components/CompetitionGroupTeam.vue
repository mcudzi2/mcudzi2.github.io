<template>
  <tr :class="rowClass">
    <td v-text="position"/>
    <td class="!text-left !w-56 flex flex-row items-center">
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
import { useGroups } from "@/stores/groups.js";
import {computed} from "vue";
import {useCompetitions} from "@/stores/competitions.js";

const competitionsStore = useCompetitions();
const groupsStore = useGroups();
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
  isThirdsGroup: {
    type: Boolean,
    default: false,
  },
});

const goalDifference = computed(() => groupsStore.calculateGoalDiff(props.team));
const points = computed(() => groupsStore.calculatePoints(props.team));
const rowClass = computed(() => {
  if (props.isThirdsGroup) {
    return props.position <= 4 ? 'border-l-4 border-l-blue-400' : '';
  }
  if (props.position <= 2) {
    return 'border-l-4 border-l-blue-400';
  }
  if (props.position === 3 && competitionsStore.currentCompetition?.hasBestOfThirds) {
    return 'border-l-4 border-l-orange-400';
  }
  return ''
});
</script>

<style scoped>

</style>