<script setup>
import Result from './Result.vue'
import Simulation from "./Simulation.vue";
</script>

<template>
  <div class="container">
    <div class="row">
  <Simulation :quarantines="quarantines">

  </Simulation>
  <Result :quarantines="quarantines">

  </Result></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quarantines: []
    }
  }
}
</script>
