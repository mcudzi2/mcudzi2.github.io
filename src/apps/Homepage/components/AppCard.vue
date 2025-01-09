<template>
  <RouterLink :to="link">
    <div
      v-bind="$attrs"
      class="rounded-2xl bg-neutral-200 flex flex-row items-center justify-center min-h-60 hover:opacity-95 hover:scale-105 transition-all"
    >
      <h2
        :class="textColor"
        v-text="name"
      />
    </div>
  </RouterLink>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: [String, Object],
    required: true,
  },
  textColor: {
    type: String,
    default: '', //use default app text color
  },
});
</script>