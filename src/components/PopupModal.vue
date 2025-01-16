<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed top-0 left-0 w-screen h-screen bg-black/20 dark:bg-white/10 z-[999]"
      @click="closeOnBackdropClick && close()"
    />
    <div
      v-if="open"
      class="fixed max-h-[90vh] max-w-[95vw] min-w-80 rounded-2xl border-neutral-300 bg-white dark:bg-neutral-800 z-[1000] divide-y divide-slate-400/50 top-10 left-1/2 -translate-x-1/2 px-3 flex flex-col"
    >
      <div class="flex-none flex flex-row items-center gap-x-4 p-4 rounded-t-2xl">
        <div
          class="flex-1"
          :class="headerClasses"
        >
          <slot name="header">
            <h2 v-text="heading" />
          </slot>
        </div>
        <SvgIcon
          name="close"
          class="text-3xl text-neutral-500 opacity-70 hover:opacity-100 cursor-pointer"
          @click="close"
        />
      </div>
      <div class="flex-1 p-6 overflow-y-auto">
        <slot />
      </div>
      <div
        class="flex-none flex flex-row items-center gap-x-4 p-4"
        :class="footerClasses"
      >
        <slot name="footer">
          <ActionButton
            v-if="cancelButtonText"
            type="secondary"
            :text="cancelButtonText"
            @click="cancel"
          />
          <ActionButton
            v-if="confirmationButtonText"
            type="primary"
            :text="confirmationButtonText"
            @click="confirm"
          />
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import ActionButton from "@/components/ActionButton.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  heading: {
    type: String,
    default: '',
  },
  closeButtonText: {
    type: String,
    default: 'OK',
  },
  closeOnBackdropClick: {
    type: Boolean,
    default: true,
  },
  closeOnCancel: {
    type: Boolean,
    default: true,
  },
  closeOnConfirm: {
    type: Boolean,
    default: true,
  },
  headerClasses: {
    type: [String, Array, Object],
    default: '',
  },
  footerClasses: {
    type: [String, Array, Object],
    default: 'justify-end',
  },
  confirmationButtonText: {
    type: String,
    default: 'OK',
  },
  cancelButtonText: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['close' , 'confirm', 'cancel']);
function close() {
  emit('close');
}

function cancel() {
  emit('cancel');
  if (props.closeOnCancel) {
    emit('close');
  }
}

function confirm() {
  emit('confirm');
  if (props.closeOnConfirm) {
    emit('close');
  }
}
</script>