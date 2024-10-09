<template>
  <ol class="flex items-center whitespace-nowrap">
    <li v-for="crumb in crumbs" class="inline-flex items-center">
      <NuxtLink active-class="text-gray-900" :to="`/library/${currentLibraryId}/series/${crumb.id}`"
      >{{crumb.name}}</NuxtLink>
      <svg class="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    crumbs: [],
    required: true
  },
  computed: {
    currentLibraryId() {
      return this.$store.state.libraries.currentLibraryId
    },
  }
}
</script>


<style scoped>


</style>
