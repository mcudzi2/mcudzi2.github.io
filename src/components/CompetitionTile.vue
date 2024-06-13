<template>
  <RouterLink :to="link">
    <div class="h-80 w-80 rounded-xl bg-white border border-neutral-300 shadow-md flex flex-col items-center justify-center gap-y-6">
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