<template>
  <div class="w-full bg-neutral-50 pt-4">
    <div class="flex flex-row items-center w-full gap-x-8">
      <div
        v-if="imageUrl"
        class="h-16 max-w-28 md:h-24 md:max-w-32"
      >
        <img
          :src="imageUrl"
          :alt="name"
          class="max-w-full max-h-full"
        />
      </div>
      <h1
          class="hidden md:block"
          v-text="pageHeaderText"
      />
      <h2
          class="block md:hidden"
          v-text="pageHeaderText"
      />
    </div>
    <hr class="mt-6" />
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  stage: {
    type: String,
    required: true,
    validator: (value) => ['group', 'knockout'].includes(value),
  },
});

const pageHeaderText = computed(() => {
  const stageName = props.stage.charAt(0).toUpperCase() + props.stage.slice(1);
  return props.name ? `${props.name} ${stageName} Stage` : `${stageName} Stage`;
})
</script>