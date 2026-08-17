<template>
  <main class="min-h-screen bg-accent-50 text-secondary">
    <div class="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-xl rounded-3xl border border-accent-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-12">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary">
          <UiIconsError class="h-10 w-10" />
        </div>

        <div class="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          {{ statusLabel }}
        </div>

        <h1 class="mt-6 text-5xl font-semibold tracking-tight text-secondary sm:text-6xl">
          {{ errorCode }}
        </h1>

        <p class="mt-4 text-lg text-accent-600">
          {{ errorMessage }}
        </p>

        <p class="mt-2 text-sm text-accent-500">
          You can head back home or try again.
        </p>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <UiButtonsSecondary @clicked="handleReload" class="w-full sm:w-auto">
            Try again
          </UiButtonsSecondary>
          <UiButtonsPrimary @clicked="handleError" class="w-full sm:w-auto">
            Back home
          </UiButtonsPrimary>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'

const error = useError()

const errorCode = computed(() => {
  if (error && error.statusCode) return `${error.statusCode}`
  return 'Oops'
})

const statusLabel = computed(() => {
  if (error && error.statusCode) {
    if (error.statusCode >= 500) return 'Server error'
    if (error.statusCode === 404) return 'Page not found'
    if (error.statusCode === 403) return 'Access denied'
    if (error.statusCode === 401) return 'Not authorized'
    return 'Something went wrong'
  }

  return 'Something went wrong'
})

const errorMessage = computed(() => {
  if (error && error.message) return error.message
  return 'We couldn’t load this page right now.'
})

const handleReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

const handleError = () => {
  clearError({
    redirect: '/',
  })
}
</script>