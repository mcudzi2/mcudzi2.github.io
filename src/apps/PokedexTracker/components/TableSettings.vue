<template>
  <PopupModal
    heading="Table Settings"
    :open="showTableSettings"
    confirmation-button-text="Confirm"
    cancel-button-text="Cancel"
    @close="close"
    @cancel="cancel"
    @confirm="confirm"
  >
    <div class="flex flex-col gap-y-6">
      <h4>Select Pokedexes for Display</h4>
      <div
        v-for="region in regions"
        :key="region.key"
        class="space-y-2"
      >
        <h5 v-text="region.name"/>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <div
            v-for="pokedexKey in region.pokedexes"
            :key="`checkbox-${pokedexKey}`"
            class="space-x-2"
          >
            <input
              v-model="pokedexesForDisplay[pokedexKey]"
              :id="pokedexKey"
              type="checkbox"
            />
            <label
              :for="pokedexKey"
              v-text="pokedexes[pokedexKey]"
            />
          </div>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import PopupModal from "@/components/PopupModal.vue";
import { ref, watch } from "vue";

const showTableSettings = defineModel('show', {
  type: Boolean,
  required: true,
});

const settings = defineModel('settings', {
  type: Object,
  required: true,
});

defineProps({
  regions: {
    type: Array,
    default: () => [],
  },
  pokedexes: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update']);

const pokedexesForDisplay = ref({});

function close() {
  showTableSettings.value = false;
}

function cancel() {
  Object.assign(pokedexesForDisplay.value, settings.value?.pokedexes || {});
}

function confirm() {
  Object.assign(settings.value.pokedexes, pokedexesForDisplay.value);
  emit('update');
}

watch(() => showTableSettings.value, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    Object.assign(pokedexesForDisplay.value, settings.value?.pokedexes || {});
  }
})
</script>