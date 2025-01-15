<template>
  <button :class="buttonClasses">
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  text: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm','md','lg'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const buttonClasses = computed(() => {
  const classes = ['text-neutral-50 hover:opacity-75 rounded-md'];
  switch (props.type) {
    case 'secondary':
      classes.push('bg-neutral-600');
      break;
    case 'primary':
    default:
      classes.push('bg-red-600');
      break;
  }
  switch (props.size) {
    case 'lg':
      classes.push('px-6 py-3 text-lg');
      break;
    case 'sm':
      classes.push('px-2 py-1 text-sm');
      break;
    case 'md':
    default:
      classes.push('px-4 py-2 text-base');
      break;
  }
  classes.push(props.disabled ? 'cursor-not-allowed !opacity-50' : 'cursor-pointer');
  return classes.join(' ');
})
</script>