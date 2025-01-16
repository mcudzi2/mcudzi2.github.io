<template>
  <div class="flex flex-col gap-y-1">
    <div
      v-if="showCount || showPercentage"
      class="flex flex-row items-center justify-between"
    >
      <p
        v-show="showCount"
        v-text="completionCount"
        class="text-sm"
      />
      <p
        v-show="showPercentage"
        v-text="percentage"
        class="text-sm"
      />
    </div>
    <div class="rounded-full h-6 w-full relative overflow-hidden">
      <div
        class="absolute top-0 bottom-0 left-0 z-10 opacity-50 w-full"
        :class="barColorClass"
      />
      <div
        class="absolute top-0 bottom-0 left-0 z-20"
        :class="barColorClass"
        :style="barStyle"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  count: {
    type: [Number, String],
    default: 0,
  },
  total: {
    type: [Number, String],
    default: 1,
  },
  showCount: {
    type: Boolean,
    default: true,
  },
  showPercentage: {
    type: Boolean,
    default: true,
  },
  percentageDecimalPlaces: {
    type: [Number, String],
    default: 0,
  },
  barColorClass: {
    type: String,
    default: 'bg-lime-700',
  },
});

const countInt = computed(() => parseInt(props.count));
const totalInt = computed(() => parseInt(props.total));

const completionCount = computed(() => `${countInt.value} / ${totalInt.value}`);
const percentage = computed(() => {
  let percentage = 0;
  // Done as switch case to try to avoid JS floating point rounding errors
  switch (countInt.value) {
    case 0:
      break;
    case totalInt.value:
      percentage = 100;
      break;
    default:
      percentage = (100 * countInt.value) / totalInt.value;
      break;
  }
  return `${percentage.toFixed(parseInt(props.percentageDecimalPlaces))}%`;
});

const barStyle = computed(() => ({ width: percentage.value }));
</script>

<style scoped lang="scss">

</style>