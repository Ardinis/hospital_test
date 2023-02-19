<script setup>
</script>
<template>
  <div class="col">
    <h1>Last 10 Patients history</h1>
      <PatientByStates v-for="(quarantine, key) in quarantines.slice(-10).reverse()" :key="key" :quarantine="quarantine" :indexOfTotal="quarantines.length-key"/>
  </div>
</template>

<script>
import PatientByStates from "@/mixin/PatientByStates.vue";
export default {
  props: ['quarantines'],
  components: {PatientByStates}
}
</script>