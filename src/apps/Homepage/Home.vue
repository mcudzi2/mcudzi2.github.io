<template>
  <div class="flex flex-col justify-center gap-y-16 min-h-screen">
    <h1 class="text-center" @click="addApp">My Homepage</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-12 2xl:gap-20">
      <AppCard
          v-for="app in apps"
          :key="app.id"
          :name="app.name"
          :link="app.link"
          :text-color="app.textColor"
          :class="app.classes"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AppManager from "@/services/AppManager.js";
import AppCard from "@/apps/Homepage/components/AppCard.vue";

const apps = computed(() => AppManager.getAppCards());
</script>