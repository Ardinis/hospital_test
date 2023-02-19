<template>
  <div class="col">
    <button class="btn btn-primary" @click="getDataFromServer" :disabled="initialPatientByStates && !finished">Get my patients and drugs automatically</button>
    <button class="btn btn-info" @click="giveDrugs" :disabled="finished">Give drugs to patients</button>
    <button :class="{'btn-danger': automatic, 'btn-info': !automatic}" class="btn" @click="toggleTimer">Automatic refresh every {{configs.autoRefreshSeconds/1000}} seconds</button>
    <p v-if="automatic">Remaining {{(timer/1000)}} seconds</p>
    <div v-if="initialPatientByStates">
      <h1>Initial patients status</h1>
      <p>Fever: {{initialPatientByStates["F"] ?? 0}}</p>
      <p>Diabetes: {{initialPatientByStates["D"] ?? 0}}</p>
      <p>Healthy: {{initialPatientByStates["H"] ?? 0}}</p>
      <p>Tuberculosis: {{initialPatientByStates["T"] ?? 0}}</p>
      <p>Dead: {{initialPatientByStates["X"] ?? 0}}</p>
      <div>
      <p>Drugs to administer: {{!this.currentDrugs.length ? 'None': ''}}</p>
      <ul>
        <li v-for="drug in currentDrugs">
          {{configs.drugsMapping[drug]}}
        </li>
      </ul>
      </div>
    </div>
    <div v-if="finalPatientByStates">
      <h1>Current patients status</h1>
      <p>Fever: {{ finalPatientByStates["F"] ?? 0 }}</p>
      <p>Diabetes: {{ finalPatientByStates["D"] ?? 0 }}</p>
      <p>Healthy: {{ finalPatientByStates["H"] ?? 0 }}</p>
      <p>Tuberculosis: {{ finalPatientByStates["T"] ?? 0 }}</p>
      <p>Dead: {{ finalPatientByStates["X"] ?? 0 }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {Quarantine} from "hospital-lib";
import configs from '../config'

export default {
  props: ['quarantines'],
  data() {
    return {
      configs,
      currentQuarantine: null,
      currentDrugs: null,
      initialPatientByStates: null,
      finalPatientByStates: null,
      finished: false,
      automatic: false,
      timer: configs.autoRefreshSeconds
    }
  },
  mounted() {
    axios.defaults.baseURL = import.meta.env.VITE_HOSPITAL_HOST;
    setInterval(() => {
      if (this.automatic) {
        this.timer -= 1000;
      }
    }, 1000);
  },
  methods: {
    async getDataFromServer() {
      if (this.finished) {
        this.currentQuarantine = null;
        this.currentDrugs = null;
        this.initialPatientByStates = null;
        this.finalPatientByStates = null;
        this.finished = false;
      }
      let patients = [];
      let drugs = [];
      let call = await axios.get('/patients');
      if (call.data) {
        patients = call.data.split(',');
      }
      call = await axios.get('/drugs');
      if (call.data) {
        drugs = call.data.split(',');
      }
      this.currentDrugs = drugs;
      this.initialPatientByStates = patients.reduce((map, val) => {map[val] = (map[val] || 0)+1; return map}, {} );
      this.currentQuarantine = new Quarantine(this.initialPatientByStates);
      this.currentQuarantine.setDrugs(drugs);
    },
    giveDrugs() {
      if (this.finished) {
        return;
      }
      this.currentQuarantine.wait40Days();
      this.finalPatientByStates = this.currentQuarantine.report();
      this.quarantines.push({initial: this.initialPatientByStates, final: this.finalPatientByStates, drugs: this.currentDrugs});
      this.finished = true;
    },
    toggleTimer() {
      if (!this.automatic) {
        this.timer = configs.autoRefreshSeconds;
        this.automatic = setInterval(() => {
          this.getDataFromServer().then(() => {
            this.giveDrugs();
            this.timer = configs.autoRefreshSeconds;
          })
        }, configs.autoRefreshSeconds);
      } else {
        clearInterval(this.automatic);
        this.automatic = false;
      }
    }
  }
}
</script>