<template>
  <nav class="flex justify-center items-center gap-1 select-none" aria-label="Pagination">
    <!-- Prev Page -->
    <button
      :class="[
        'w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md border border-accent-200 transition-colors duration-200 flex items-center justify-center',
        (isFirstPage || disabled) ? 'opacity-50 cursor-not-allowed bg-accent-100 text-accent-400' : 'text-secondary bg-white hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus:outline-none'
      ]"
      :disabled="isFirstPage || disabled"
      @click="goToPage(currentPageNum - 1)"
      aria-label="Previous page"
    >
      <UiIconsChevron class="w-4 h-4 -rotate-90" />
    </button>

    <!-- Page Numbers with Ellipsis -->
    <template v-for="page in pagesToShow" :key="page.key">
      <span v-if="page.ellipsis" class="px-2 text-accent-400">…</span>
      <button
        v-else-if="typeof page.num === 'number'"
        :class="[
          'w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md border border-accent-200 transition-colors duration-200 flex items-center justify-center',
          page.num === currentPageNum ? 'bg-secondary text-white' : 'text-secondary bg-white hover:bg-primary hover:text-white',
          (page.num === currentPageNum || disabled) ? 'opacity-50 cursor-not-allowed' : 'focus-visible:bg-primary focus-visible:text-white focus:outline-none'
        ]"
        :disabled="page.num === currentPageNum || disabled"
        @click="goToPage(page.num!)"
        :aria-current="page.num === currentPageNum ? 'page' : undefined"
        :aria-label="'Go to page ' + page.num"
      >
        {{ page.num }}
      </button>
    </template>

    <!-- Next Page -->
    <button
      :class="[
        'w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md border border-accent-200 transition-colors duration-200 flex items-center justify-center',
        (isLastPage || disabled) ? 'opacity-50 cursor-not-allowed bg-accent-100 text-accent-400' : 'text-secondary bg-white hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus:outline-none'
      ]"
      :disabled="isLastPage || disabled"
      @click="goToPage(currentPageNum + 1)"
      aria-label="Next page"
    >
      <UiIconsChevron class="w-4 h-4 rotate-90" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

/**
 * Pagination component for navigating paged data.
 * @prop {number} currentPage - The current active page (1-based)
 * @prop {number} totalPages - Total number of pages
 * @prop {number} [pageRange=4] - How many pages to show on each side of the current page
 * @prop {boolean} [disabled=false] - Disable all controls
 * @event page-changed - Emits the new page number when changed
 */
const props = defineProps({
  currentPage: {
    type: [Number, String],
    required: true
  },
  totalPages: {
    type: [Number, String],
    required: true
  },
  pageRange: {
    type: Number,
    default: 4
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-changed'])

// Always use number versions for logic
const currentPageNum = computed(() => Number(props.currentPage))
const totalPagesNum = computed(() => Number(props.totalPages))

const isFirstPage = computed(() => currentPageNum.value === 1)
const isLastPage = computed(() => currentPageNum.value === totalPagesNum.value)

function goToPage(page: number) {
  if (page < 1 || page > totalPagesNum.value || page === currentPageNum.value) return
  emit('page-changed', page)
}

// Compute which pages to show (with ellipsis)
const pagesToShow = computed(() => {
  const pages: Array<{ num?: number; ellipsis?: boolean; key: string | number }> = []
  const currentPage = currentPageNum.value
  const totalPages = totalPagesNum.value
  const pageRange = props.pageRange

  // Show all page numbers if totalPages <= 7
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ num: i, key: i })
    }
    return pages
  }

  // Ellipsis logic for larger page counts
  const minPage = Math.max(2, currentPage - pageRange)
  const maxPage = Math.min(totalPages - 1, currentPage + pageRange)

  // Always show first page
  pages.push({ num: 1, key: 1 })

  // Ellipsis before
  if (minPage > 2) {
    pages.push({ ellipsis: true, key: 'start-ellipsis' })
  }

  // Middle pages
  for (let i = minPage; i <= maxPage; i++) {
    pages.push({ num: i, key: i })
  }

  // Ellipsis after
  if (maxPage < totalPages - 1) {
    pages.push({ ellipsis: true, key: 'end-ellipsis' })
  }

  // Always show last page if more than one
  if (totalPages > 1) {
    pages.push({ num: totalPages, key: totalPages })
  }

  return pages
})
</script> 