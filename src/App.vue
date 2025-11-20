<template>
  <div class="">
    <Navbar />
    <RouterView />
  </div>
</template>

<script>

import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar,

  },
}

</script>


<style scoped>
.card-header {
  background-color: #1A1F2E;
  color: white;
}
</style>
