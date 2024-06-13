<template>
  <div
    class="flex items-center gap-x-4"
    :class="[flipped ? 'flex-row-reverse' : 'flex-row']"
  >
    <h4 v-text="team.abbr" />
    <h4>|</h4>
    <h4
      class="font-normal mx-2"
      v-text="team.name"
    />
  </div>
</template>

<script setup>
defineProps({
  team: {
    type: Object,
    required: true,
  },
  flipped: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
div > h4 {
  @apply text-lg;
}
</style>