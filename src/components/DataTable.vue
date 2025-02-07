<template>
  <div ref="tableContainer">
    <table
      class="w-full relative"
      :class="tableClasses"
      :style="tableStyle"
    >
      <thead :class="{ 'fixed-headers': fixHeaders }">
        <tr :class="headerClasses">
          <th
            v-for="header in headers"
            :key="header.value"
            :class="header.headerCellClasses || headerCellClasses(header)"
          >
            <div
              class="flex flex-row items-center gap-x-0.5 cursor-pointer"
              :class="header.headerContentClasses || headerContentClasses(header)"
              @click="toggleSort(header.sortBy || header.value, header.value)"
            >
              <slot
                :name="`header-${header.value}`"
                v-bind="header"
              >
                <h5 v-text="header.name" />
              </slot>
              <SvgIcon
                name="caret"
                :rotate="sortBy.dir === 'asc' ? 0 : 180"
                class="sort-icon"
                :class="{ '!opacity-100': sortBy.header === header.value }"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody ref="tableBody">
        <tr
          v-if="useVirtualScroll"
          :style="{ height: `${prePaddingRenderHeight}px` }"
        >
          <td
            colspan="100%"
            class="!p-0 !m-0"
          />
        </tr>
        <tr
          v-for="item in itemsToDisplay"
          :key="item[itemTrackBy]"
          :class="item.rowClasses || rowClasses(item)"
        >
          <td
            v-for="header in headers"
            :key="`${item[itemTrackBy]}-${header.value}`"
            :class="item.rowCellClasses || rowCellClasses(item, header)"
          >
            <div
              class="flex flex-col"
              :class="header.rowContentClasses || rowContentClasses(item, header)"
            >
              <slot
                :name="`item-${header.value}`"
                v-bind="item"
              >
                <p
                 v-if="!header.allowHTML"
                 v-text="get(item, header?.displayAs || header.value)"
                />
                <div
                  v-else
                  v-html="get(item, header?.displayAs || header.value)"
                />
              </slot>
            </div>
          </td>
        </tr>
        <tr
          v-if="useVirtualScroll"
          :style="{ height: `${postPaddingRenderHeight}px` }"
        >
          <td
            colspan="100%"
            class="!p-0 !m-0"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { get, debounce } from 'lodash';

const sortBy = defineModel('sortBy', {
  type: Object,
  default: () => ({
    header: '',
    key: '',
    dir: '',
  }),
  validator: (value) => ['key', 'dir'].every(key => key in value),
});

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemTrackBy: {
    type: String,
    default: 'id',
  },
  fixHeaders: {
    type: Boolean,
    default: false,
  },
  searchTerm: {
    type: String,
    default: '',
  },
  searchFields: {
    type: [String, Array],
    default: '',
  },
  caseSensitiveSearch: {
    type: Boolean,
    default: false,
  },
  tableClasses: {
    type: [String, Array, Object],
    default: '',
  },
  tableStyle: {
    type: [String, Array, Object],
    default: '',
  },
  headerClasses: {
    type: [String, Array, Object],
    default: ''
  },
  headerCellClasses: {
    type: Function,
    default: () => (() => {}),
  },
  headerContentClasses: {
    type: Function,
    default: () => (() => {}),
  },
  rowClasses: {
    type: Function,
    default: () => (() => {}),
  },
  rowCellClasses: {
    type: Function,
    default: () => (() => {}),
  },
  rowContentClasses: {
    type: Function,
    default: () => (() => {}),
  },
  useVirtualScroll: {
    type: Boolean,
    default: false,
  },
  rowHeight: {
    type: [Number, Function],
    default: 0,
  },
  paddingItemCount: {
    type: Number,
    default: 3,
  },
});

function compareStringToSearchTerm(string) {
  return props.caseSensitiveSearch
    ? string.includes(props.searchTerm)
    : string.toLocaleLowerCase().includes(props.searchTerm.toLocaleLowerCase());
}

function propertyMatchesSearchTerm(item, field) {
  const value = get(item, field);
  if (value === undefined || value === null) {
    return false;
  }
  switch (typeof value) {
    case 'number':
      return compareStringToSearchTerm(value.toString());
    case 'string':
      return compareStringToSearchTerm(value);
    default:
      return false;
  }
}

const searchedItems = computed(() => {
  if (!props.searchTerm?.length) {
    return props.items;
  }

  return props.items.filter(item => {
    if (props.searchFields?.length) {
      const fields = Array.isArray(props.searchFields) ? props.searchFields : [props.searchFields];
      return fields.some(field => propertyMatchesSearchTerm(item, field));
    }
    return Object.values(item).some(field => propertyMatchesSearchTerm(item, field));
  })
});

function compareItemsByField(itemA, itemB, field) {
  const valueA = get(itemA, field);
  const valueB = get(itemB, field);
  const valueAisEmpty = (valueA === null || valueA === undefined);
  const valueBisEmpty = (valueB === null || valueB === undefined);
  if (valueAisEmpty && valueBisEmpty) {
    return 0;
  }
  if (valueAisEmpty) {
    return 1;
  }
  if (valueBisEmpty) {
    return -1;
  }
  switch (typeof valueA) {
    case 'number':
      return sortBy.value.dir === 'asc'
          ? valueA - valueB
          : valueB - valueA;
    case 'string':
      return sortBy.value.dir === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
    default:
      return 0;
  }
}

const sortedItems = computed(() => {
  if (!sortBy.value.key?.length) {
    return searchedItems.value;
  }

  const sortKeys = Array.isArray(sortBy.value.key)
    ? sortBy.value.key
    : [sortBy.value.key];
  return searchedItems.value.sort((itemA, itemB) => {
    let sortValue = 0;
    for (let field of sortKeys) {
      sortValue = compareItemsByField(itemA, itemB, field);
      if (sortValue !== 0) {
        break;
      }
    }
    return sortValue;
  })
});

function toggleSort(headerKey, headerValue) {
  if (headerValue !== sortBy.value.header) {
    sortBy.value.header = headerValue;
    sortBy.value.key = headerKey;
    sortBy.value.dir = 'asc';
  } else {
    sortBy.value.header = sortBy.value.dir === 'desc' ? '' : headerValue;
    sortBy.value.key = sortBy.value.dir === 'desc' ? '' : headerKey;
    sortBy.value.dir = sortBy.value.dir === 'asc' ? 'desc' : 'asc';
  }
}

//Virtual Scroll
const tableContainer = ref();
const tableHeight = ref(0);
const tableScrollTop = ref(0);
const itemsWithPositions = computed(() => {
  if (!props.useVirtualScroll || typeof props.rowHeight === 'number') {
    return sortedItems.value;
  }

  return sortedItems.value.map(item => ({ ...item, position: props.rowHeight(item) }));
});
const renderStartIndex = computed(() => {
  if (!props.useVirtualScroll) {
    return 0;
  }

  if (typeof props.rowHeight === 'number') {
    return Math.max(Math.floor(tableScrollTop.value / props.rowHeight) - props.paddingItemCount, 0);
  }

  // TODO: Implement dynamic row height virtual scroll
});
const itemsToRenderCount = computed(() => {
  if (!props.useVirtualScroll) {
    return sortedItems.value.length;
  }

  if (typeof props.rowHeight === 'number') {
    const itemCount = Math.ceil(tableHeight.value / props.rowHeight) + (2 * props.paddingItemCount);
    return renderStartIndex.value + itemCount > itemsWithPositions.value.length
      ? itemsWithPositions.value.length - renderStartIndex.value
      : itemCount;
  }

  // TODO: Implement dynamic row height virtual scroll
});
const prePaddingRenderHeight = computed(() => {
  return (typeof props.rowHeight === 'number')
      ? props.rowHeight * renderStartIndex.value
      : itemsWithPositions.value[renderStartIndex.value].position;
})
const postPaddingRenderHeight = computed(() => {
  return (typeof props.rowHeight === 'number')
      ? (props.rowHeight * itemsWithPositions.value.length - props.rowHeight * itemsToRenderCount.value - prePaddingRenderHeight.value)
      : itemsWithPositions.value[renderStartIndex.value].position;
})
const itemsToDisplay = computed(() => {
  return props.useVirtualScroll
    ? itemsWithPositions.value.slice(renderStartIndex.value, renderStartIndex.value + itemsToRenderCount.value)
    : itemsWithPositions.value;
});

const handleScroll = debounce(() => {
  if (!props.useVirtualScroll) {
    return;
  }
  tableScrollTop.value = tableContainer.value.scrollTop;
}, );
const handleResize = debounce(() => {
  if (!props.useVirtualScroll) {
    return;
  }
  tableHeight.value = tableContainer.value.clientHeight;
}, );

onMounted(() => {
  tableHeight.value = tableContainer?.value?.clientHeight || 0;
  tableScrollTop.value = tableContainer?.value?.scrollTop || 0;
  window.addEventListener('resize', handleResize);
  tableContainer.value.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  tableContainer.value.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
table {
  @apply border-separate border-spacing-0;

  th, td {
    @apply p-1 sm:py-3 sm:px-2;
  }

  thead {
    &.fixed-headers {
      @apply sticky top-0 z-20 bg-neutral-50 dark:bg-neutral-800;
    }

    tr {
      th {
        @apply border-b-2 border-slate-400/50;

        .sort-icon {
          @apply text-base sm:text-lg opacity-0;
        }

        &:hover {
          .sort-icon {
            @apply opacity-60;
          }
        }
      }
    }
  }

  tbody {
    tr {
      td {
        @apply border-b border-slate-400/50;
      }
    }
  }
}
</style>