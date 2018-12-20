<template>
  <div>
    <header-component></header-component>
    <footer-component></footer-component>
    <router-view :key="$route.fullpath" />
  </div>

</template>

<script>
  import headerComponent from '@/pages/layout/components/header';
  import footerComponent from '@/pages/layout/components/footer';

  export default {
    name: "layout",
    components: {
      headerComponent,
      footerComponent
    },
  }
</script>

<style scoped>

</style>
