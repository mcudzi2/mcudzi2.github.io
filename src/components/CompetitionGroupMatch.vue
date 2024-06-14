<template>
  <div
    class="w-full rounded-xl py-1 px-3 flex flex-row items-center gap-x-2 sm:gap-x-4"
    :class="backgroundColorClasses"
  >
    <CompetitionMatchTeam
      :team="match.team1"
      class="flex-1"
    />
    <input
      v-model="match.team1Score"
      type="number"
      min="0"
      @input="groupsStore.updateMatchStats()"
    />
    <input
      v-model="match.team2Score"
      type="number"
      min="0"
      @input="groupsStore.updateMatchStats()"
    />
    <CompetitionMatchTeam
      :team="match.team2"
      flipped
      class="flex-1"
    />
  </div>
</template>

<script setup>
import CompetitionMatchTeam from "@/components/CompetitionMatchTeam.vue";
import {useGroups} from "@/stores/groups.js";
import {computed} from "vue";

const groupsStore = useGroups();
const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
    validator: (value) => Number.isInteger(value) && value >= 0,
  },
});

const backgroundColorClasses = computed(() => {
  const classes = [];
  classes.push(props.index % 2 ? 'bg-lime-600/70' : 'bg-lime-700/70');
  classes.push((props.index % 4 < 2) ? 'xl:bg-lime-600/70' : 'xl:bg-lime-700/70');
  return classes.join(' ');
})
</script>

<style scoped lang="scss">
input {
  @apply bg-neutral-100 w-10 p-0.5 font-bold text-center text-xl rounded-xl;
  @apply text-neutral-700 #{!important};
}
</style>