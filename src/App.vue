<template>
  <div class="absolute top-0 right-0 p-4">
    <button
      type="button"
      class="p-3 border border-neutral rounded-md"
      :class="buttonClass"
      v-text="buttonText"
      @click="toggleDarkMode"
    />
  </div>
  <div class="absolute top-0 left-0 p-4">
    <RouterLink to="/">
      <button
          type="button"
          class="p-3 border border-neutral rounded-md"
          :class="buttonClass"
      >
        Home
      </button>
    </RouterLink>
  </div>
  <RouterView />
</template>

<script setup>
import {computed, ref} from "vue";

const darkMode = ref(false);
const buttonText = computed(() => darkMode.value ? 'Light Mode' : 'Dark Mode');
const buttonClass = computed(() => darkMode.value ? 'bg-white !text-neutral-700 font-light' : 'bg-neutral-700 !text-neutral-50 font-medium');
function toggleDarkMode() {
  darkMode.value = !darkMode.value;
  setDarkMode();
}

function setDarkMode() {
  const body = document.getElementsByTagName('body')[0];
  if (darkMode.value) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

setDarkMode();
</script>