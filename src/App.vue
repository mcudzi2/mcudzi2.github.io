<template>
  <div class="absolute top-4 left-4">
    <RouterLink :to="{ name: 'homepage' }">
      <SvgIcon
          name="github-mark"
          title="Home"
          class="text-4xl text-neutral-500 hover:text-emerald-700 hover:scale-110 transition-transform cursor-pointer"
      />
    </RouterLink>
  </div>
  <div class="dark-mode-trigger-container">
    <SvgIcon
      name="sun"
      title="Light Mode"
      class="icon light-mode-icon"
      :class="{ active: !darkMode }"
      @click="setDarkMode(false)"
    />
    <SvgIcon
      name="moon"
      title="Dark Mode"
      class="icon dark-mode-icon"
      :class="{ active: darkMode }"
      @click="setDarkMode(true)"
    />
  </div>
  <RouterView />
</template>

<script setup>
import { ref, watch } from 'vue';
import SvgIcon from "@/components/SvgIcon.vue";

const darkMode = ref(false);
watch(() => darkMode.value, (newValue, oldValue) => {
  if (oldValue !== newValue) {
    if (newValue) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
});

function setDarkMode (value) {
  darkMode.value = value;
  localStorage.setItem('app-theme', value ? 'dark' : 'light');
}

const savedSetting = localStorage.getItem('app-theme');
if (!savedSetting) {
  // Use OS/browser preference
  darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
} else {
  darkMode.value = (savedSetting === 'dark');
}
</script>

<style scoped lang="scss">
.dark-mode-trigger-container {
  @apply transition-all absolute top-2 right-4;
  @apply flex flex-row gap-x-3 p-2;
  @apply rounded-md opacity-70 cursor-pointer;

  &:hover {
    @apply top-3 right-6 scale-125 opacity-100 bg-neutral-500/10;
  }

  .icon {
    @apply text-2xl text-neutral-500 p-0.5 opacity-100;

    &.light-mode-icon {
      &.active {
        @apply text-amber-500;
      }
      &:hover {
        @apply text-amber-400;
      }
    }

    &.dark-mode-icon {
      &.active {
        @apply text-indigo-900 dark:text-indigo-700;
      }
      &:hover {
        @apply text-indigo-700 dark:text-indigo-600;
      }
    }
  }
}
</style>