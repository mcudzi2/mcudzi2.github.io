<template>
  <RouterLink :to="link">
    <div class="container">
      <div class="w-full h-1/2">
        <img
          :src="imageUrl"
          :alt="name"
          class="object-contain"
        />
      </div>
      <h4 v-text="name" />
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    required:true,
  },
});
</script>

<style scoped lang="scss">
.container {
  @apply h-80 w-80 rounded-xl border border-neutral-300 shadow-lg flex flex-col items-center justify-center gap-y-6;
  @apply bg-white;
}

.dark-mode {
  .container{
    @apply bg-neutral-500 shadow-neutral-600 border-neutral-400;
  }
}
</style>