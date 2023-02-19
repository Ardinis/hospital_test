<template>
  <h3>History #{{indexOfTotal}}</h3>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th scope="col">Drugs</th>
        <th colspan="2">
  <span v-for="(drug, key) in quarantine.drugs">
     {{ configs.drugsMapping[drug] + (quarantine.drugs.length -1 != key ? ', ': '')}}
  </span></th>
      </tr>
      <tr>
        <th scope="col">Status</th>
        <th scope="col">Initial count</th>
        <th scope="col">Final count</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Fever</td>
        <td>{{quarantine.initial["F"] ?? 0}}</td>
        <td>{{quarantine.final["F"] ?? 0}}</td>
      </tr>
      <tr>
        <td>Diabetes</td>
        <td>{{quarantine.initial["D"] ?? 0}}</td>
        <td>{{quarantine.final["D"] ?? 0}}</td>
      </tr>
      <tr>
        <td>Healthy</td>
        <td>{{quarantine.initial["H"] ?? 0}}</td>
        <td>{{quarantine.final["H"] ?? 0}}</td>
      </tr>
      <tr>
        <td>Tuberculosis</td>
        <td>{{quarantine.initial["T"] ?? 0}}</td>
        <td>{{quarantine.final["T"] ?? 0}}</td>
      </tr>
      <tr>
        <td>Dead</td>
        <td>{{quarantine.initial["X"] ?? 0}}</td>
        <td>{{quarantine.final["X"] ?? 0}}</td>
      </tr>
      </tbody>
    </table>
</template>

<script>
import configs from '../config'

export default {
  props: ['quarantine', 'indexOfTotal'],
  data() {
    return {
      configs,
    }
  }
}
</script>