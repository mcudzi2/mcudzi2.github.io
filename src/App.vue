<template>
  <div class="absolute top-4 right-4 z-30 gap-x-4 flex flex-row items-start w-60">
    <div class="flex-1 flex flex-col gap-y-4">
      <RouterLink to="/">
        <button
            type="button"
            class="p-3 border border-neutral rounded-md w-full"
            :class="buttonClass"
        >
          Home
        </button>
      </RouterLink>
      <button
          v-if="expandedMenu"
          type="button"
          class="p-3 border border-neutral rounded-md w-full"
          :class="buttonClass"
          @click="savePredictions"
      >
        Save Predictions
      </button>
      <button
          v-if="expandedMenu"
          type="button"
          class="p-3 border border-neutral rounded-md w-full"
          :class="buttonClass"
          @click="clearPredictions"
      >
        Clear Predictions
      </button>
      <button
          v-if="expandedMenu"
          type="button"
          class="p-3 border border-neutral rounded-md w-full"
          :class="buttonClass"
          v-text="buttonText"
          @click="toggleDarkMode"
      />
    </div>
    <div class="w-12">
      <button
          type="button"
          class="p-3 border border-neutral rounded-md w-full"
          :class="[buttonClass, expandedMenu ? '' : 'rotate-180']"
          @click="expandedMenu = !expandedMenu"
      >
        &#11165;
      </button>
    </div>
  </div>
  <div
    v-if="showSuccessfulSaveMessage"
    class="bg-lime-100 border border-lime-800 absolute top-0 left-1/2 -translate-x-1/2 z-40 mt-8 px-10 py-4 text-center space-y-6 w-full lg:w-1/2 rounded-2xl"
  >
    <h3 class="!text-lime-800">SUCCESS</h3>
    <p class="!text-neutral-700">Your predictions have been successfully saved!</p>
  </div>
  <RouterView />
</template>

<script setup>
import {computed, ref} from "vue";
import {useGroups} from "@/stores/groups.js";

const expandedMenu = ref(false);
const darkMode = ref(false);
const buttonText = computed(() => darkMode.value ? 'Light Mode' : 'Dark Mode');
const buttonClass = computed(() => darkMode.value ? 'bg-white !text-neutral-700 font-light' : 'bg-neutral-700 !text-neutral-50 font-medium');
function toggleDarkMode() {
  darkMode.value = !darkMode.value;
  setDarkMode(darkMode.value);
}

function setDarkMode(value) {
  localStorage.setItem('bracket-creator-dark-mode', value)
  const body = document.getElementsByTagName('body')[0];
  if (value) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

setDarkMode(!!localStorage.getItem('bracket-creator-dark-mode'))

const showSuccessfulSaveMessage = ref(false);
const groupsStore = useGroups();
function savePredictions() {
  if (groupsStore.save()) {
    showSuccessfulSaveMessage.value = true;
    setTimeout(() => {
      showSuccessfulSaveMessage.value = false;
    }, 2000);
  } else {
    alert("ERROR: Unable to save match predictions because there is nothing to save.");
  }
}
function clearPredictions() {
  groupsStore.clear();
}
</script>