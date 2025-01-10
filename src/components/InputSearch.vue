<template>
  <div class="relative">
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      @input="emit('search', $event.target.value)"
    >
    <SvgIcon
      v-if="clearable"
      name="close"
      v-tippy="'Clear Search'"
      class="absolute top-1/2 right-1 -translate-y-1/2 text-sm text-neutral-500 opacity-70 hover:opacity-100 z-10 cursor-pointer"
      @click="clear"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SvgIcon from "@/components/SvgIcon.vue";

defineProps({
  placeholder: {
    type: String,
    default: 'Search...'
  },
  clearable: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(['search']);


const searchValue = ref('');
function clear() {
  searchValue.value = '';
  emit('search', searchValue.value);
}
</script>

<style scoped lang="scss">
input {
  @apply outline-none bg-transparent p-1 pr-4 w-full border-b border-b-neutral-300;

  &:focus, &:active {
    @apply outline-none border-b-neutral-500 dark:border-b-neutral-200;
  }
}
</style>