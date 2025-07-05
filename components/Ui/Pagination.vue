<template>
  <nav class="flex justify-center items-center gap-1 select-none" aria-label="Pagination">
    <!-- Prev Page -->
    <button
      class="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md text-secondary bg-white border border-accent-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus:outline-none"
      :disabled="isFirstPage || disabled"
      @click="goToPage(currentPage - 1)"
      aria-label="Previous page"
    >
      <UiIconsChevron class="w-4 h-4 -rotate-90" />
    </button>

    <!-- Page Numbers with Ellipsis -->
    <template v-for="page in pagesToShow" :key="page.key">
      <span v-if="page.ellipsis" class="px-2 text-accent-400">…</span>
      <button
        v-else-if="typeof page.num === 'number'"
        class="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md border border-accent-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus:outline-none"
        :class="{ 'bg-primary text-white': page.num === currentPage, 'text-secondary bg-white': page.num !== currentPage }"
        :disabled="page.num === currentPage || disabled"
        @click="goToPage(page.num)"
        :aria-current="page.num === currentPage ? 'page' : undefined"
        :aria-label="'Go to page ' + page.num"
      >
        {{ page.num }}
      </button>
    </template>

    <!-- Next Page -->
    <button
      class="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 p-0 m-0 text-base rounded-md text-secondary bg-white border border-accent-200 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus:outline-none"
      :disabled="isLastPage || disabled"
      @click="goToPage(currentPage + 1)"
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
 * @prop {number} [pageRange=2] - How many pages to show on each side of the current page
 * @prop {boolean} [disabled=false] - Disable all controls
 * @event page-changed - Emits the new page number when changed
 */
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  pageRange: {
    type: Number,
    default: 2
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['page-changed'])

const isFirstPage = computed(() => props.currentPage === 1)
const isLastPage = computed(() => props.currentPage === props.totalPages)

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('page-changed', page)
}

// Compute which pages to show (with ellipsis)
const pagesToShow = computed(() => {
  const pages: Array<{ num?: number; ellipsis?: boolean; key: string | number }> = []
  const { currentPage, totalPages, pageRange } = props
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