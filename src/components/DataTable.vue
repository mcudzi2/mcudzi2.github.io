<template>
  <table class="w-full relative">
    <thead :class="{ 'fixed-headers': fixHeaders }">
      <tr>
        <th
          v-for="header in headers"
          :key="header.value"
        >
          <div
            class="flex flex-row items-center gap-x-0.5 cursor-pointer"
            :class="header.headerClasses"
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
    <tbody>
      <tr
        v-for="item in sortedItemsToDisplay"
        :key="item[itemTrackBy]"
      >
        <td
          v-for="header in headers"
          :key="`${item[itemTrackBy]}-${header.value}`"
        >
          <div
            class="flex flex-col"
            :class="header.rowClasses"
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
    </tbody>
  </table>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { computed } from "vue";
import { get, clone } from 'lodash';

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

const itemsToDisplay = computed(() => {
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

const sortedItemsToDisplay = computed(() => {
  if (!sortBy.value.key?.length) {
    return itemsToDisplay.value;
  }

  const sortKeys = Array.isArray(sortBy.value.key)
    ? sortBy.value.key
    : [sortBy.value.key];
  return itemsToDisplay.value.sort((itemA, itemB) => {
    let sortValue = 0;
    for (let field of sortKeys) {
      sortValue = compareItemsByField(itemA, itemB, field);
      if (sortValue !== 0) {
        break;
      }
    }
    return sortValue;
  })
})

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