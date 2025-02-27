<template>
  <h2
    class="text-center mt-12 sm:mt-0 mb-10"
    v-text="appName"
  ></h2>
  <RouterView />
</template>

<script setup>
import { ref } from 'vue';

const appName = ref('__APP_NAME');
</script>