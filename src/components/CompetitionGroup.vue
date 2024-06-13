<template>
  <div class="w-full">
    <div class="w-1/3 bg-neutral-600 py-1 pl-6 rounded-t-md">
      <h5 class="text-white" v-text="groupName" />
    </div>
    <table class="w-full rounded-b-md rounded-tr-md overflow-hidden">
      <thead class="bg-neutral-200 font-medium">
        <tr>
          <th>Pos.</th>
          <th class="!text-left !w-64">Team</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>GD</th>
          <th>Pts</th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(team, idx) in teams"
          :key="team.abbr"
        >
          <CompetitionGroupTeam
            :position="idx + 1"
            :team="team"
            :is-thirds-group="isThirdsGroup"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {useGroups} from "@/stores/groups.js";
import {computed} from "vue";
import CompetitionGroupTeam from "@/components/CompetitionGroupTeam.vue";
import {useCompetitions} from "@/stores/competitions.js";

const competitionsStore = useCompetitions();
const groupsStore = useGroups();

const props = defineProps({
  group: {
    type: String,
    required: true,
    validator: (value) => ['A', 'B', 'C', 'D', 'E', 'F', 'thirds'].includes(value),
  },
});

const isThirdsGroup = computed(() => props.group === 'thirds' && competitionsStore.currentCompetition?.hasBestOfThirds)
const groupName = computed(() => isThirdsGroup.value ? 'Best of 3rd Place' : `Group ${props.group}`);
const teams = computed(() => isThirdsGroup.value ? groupsStore.thirdPlaceGroup : groupsStore.sortedTeamsByGroup[props.group]);
</script>

<style scoped lang="scss">
table {
  thead {
    tr {
      th {
        @apply text-center w-12 font-bold;
        @apply text-neutral-700 #{!important};
      }
    }
  }

  tbody {
    :deep(tr) {
      &:nth-child(odd) {
        @apply bg-lime-600/70;
      }

      &:nth-child(even) {
        @apply bg-lime-700/70;
      }

      td {
        @apply text-center w-16 font-medium;
        div {
          @apply font-medium;
        }
      }
    }
  }
}
</style>