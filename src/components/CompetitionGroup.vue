<template>
  <div class="w-full">
    <div class="w-1/3 bg-neutral-600 py-1 pl-6 rounded-t-md">
      <h5 class="text-white">Group {{group}}</h5>
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
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {useTeams} from "@/stores/teams.js";
import {computed} from "vue";
import CompetitionGroupTeam from "@/components/CompetitionGroupTeam.vue";

const teamsStore = useTeams();

const props = defineProps({
  group: {
    type: String,
    required: true,
    validator: (value) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(value),
  },
});

const teams = computed(() => teamsStore.teamsByGroup[props.group].concat().sort((teamA, teamB) => {
  return (((3 * teamB.wins) + teamB.draws) - ((3 * teamA.wins) + teamA.draws))
    || ((teamB.goalsFor - teamB.goalsAgainst) - (teamA.goalsFor - teamA.goalsAgainst))
    || (teamB.goalsFor - teamA.goalsFor);
}));
</script>

<style scoped lang="scss">
table {
  thead {
    tr {
      th {
        @apply text-center w-12 font-bold;
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