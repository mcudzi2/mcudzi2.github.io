<template>
  <div
    class="flex items-center gap-x-1 sm:gap-x-2"
    :class="[flipped ? 'flex-row-reverse' : 'flex-row']"
  >
    <h4
      class="w-10 hidden sm:block"
      :class="[flipped ? 'text-right' : 'text-left']"
      :title="team.name"
      v-text="team.abbr"
    />
    <h4 class="hidden sm:block">|</h4>
    <h4
      class="font-normal mx-1 sm:mx-2"
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