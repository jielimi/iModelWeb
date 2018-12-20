<template>
  <div>
    <h1>hihihi</h1>
    <router-view :key="$route.fullpath" />
  </div>

</template>

<script>
  export default {
    name: "layout"
  }
</script>

<style scoped>

</style>
