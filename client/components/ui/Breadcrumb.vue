<template>
    <li class="inline-flex items-center">
      <NuxtLink :to="to">{{label}}</NuxtLink>
      <svg class="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </li>
</template>


<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    to: String,
    required: true
  }
}
</script>


<style scoped>

</style>
