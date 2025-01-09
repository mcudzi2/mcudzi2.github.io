<template>
  <div :class="containerClasses">
    <component
      :is="icon"
      :class="iconClasses"
      :style="iconStyle"
    ></component>
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});

const icon = defineAsyncComponent(() =>
  import(`../assets/icons/${props.name}.svg`)
);

const containerClasses = computed(() => ({
  block: !props.inline,
  'inline-block leading-none': props.inline,
}));

const iconClasses = computed(() => ({
  'block h-font': true,
  'animate-spin': props.spin,
}));

const iconStyle = computed(() => ({
  transform: `rotate(${props.rotate}deg)`,
}));
</script>