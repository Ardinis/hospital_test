import {PatientsRegister} from './patientsRegister';
import {Patient} from './Patient';

export class Quarantine {
    private static readonly ALLOWED_DRUGS = ['As', 'An', 'I', 'P'];
    private readonly patients: Array<Patient>;
    private readonly drugs: Array<string>;

    constructor(patients: PatientsRegister) {
        this.patients = new Array<Patient>();
        this.drugs = new Array<string>();
        Object.keys(patients).map(state => {
            for (let i = 0; i < patients[state]; ++i) {
                this.patients.push(new Patient(state));
            }
        })
    }

    public setDrugs(drugs: Array<string>): void {
        drugs.forEach(drug => {
            if (Quarantine.ALLOWED_DRUGS.includes(drug)) {
                this.drugs.push(drug);
            } else {
                throw new Error('Quarantine Drug unhandled');
            }
        });
    }

    public wait40Days(): void {
        this.patients.forEach(patient => {
            patient.giveDrugs(this.drugs);
        })
    }

    public report(): PatientsRegister {
        const report: PatientsRegister = {
            F: 0, H: 0, D: 0, T: 0, X: 0,
        }
        this.patients.forEach(patient => report[patient.state]++)
        return report;
    }
}
