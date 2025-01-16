<template>
  <PopupModal
    heading="Capture Summary"
    :open="showCaptureSummary"
    @close="close"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-10 md:min-w-[40rem] lg:min-w-[56rem]">
      <template
        v-for="pokedex in progressData"
        :key="`${pokedex.name}-completion`"
      >
        <div class="space-y-1">
          <h5 v-text="pokedex.name" />
          <ProgressBar
            :count="pokedex.progress"
            :total="pokedex.count"
            percentage-decimal-places="2"
          />
        </div>
      </template>
    </div>
  </PopupModal>
</template>

<script setup>
import { computed, unref } from 'vue';
import PopupModal from "@/components/PopupModal.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const showCaptureSummary = defineModel('show', {
  type: Boolean,
  required: true,
});

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  completionData: {
    type: Object,
    default: () => ({}),
  },
  pokedexes: {
    type: Object,
    default: () => ({}),
  },
});

const progressData = computed(() => {
  const completionDataByPokedex = Object.values(unref(props.completionData)).reduce((completionMap, pokedexData) => ({
    ...completionMap,
    ...pokedexData,
  }), {});

  return Object.keys(props.pokedexes).map(pokedexKey => {
    if (pokedexKey !== 'national' && !props.settings?.pokedexes?.[pokedexKey]) {
      return null;
    }

    return {
      ...props.pokedexes[pokedexKey],
      progress: Object.values(completionDataByPokedex?.[pokedexKey] || {})?.filter(val => val === true)?.length || 0,
    };
  }).filter(val => val !== null);
});

function close() {
  showCaptureSummary.value = false;
}
</script>

<style scoped lang="scss">

</style>