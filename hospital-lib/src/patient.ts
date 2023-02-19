import {Quarantine} from "./quarantine";
import * as process from "process";

export class Patient {

  private _state: string;
  private _stateLock: boolean;
  private static readonly ALLOWED_HEALTH_STATUS = ['F', 'H', 'D', 'T', 'X'];
  private readonly STATE_TO_DRUGS: {[K: string]: Function};

  constructor(state: string) {
    if (!Patient.ALLOWED_HEALTH_STATUS.includes(state)) {
      throw new Error('Patient Health Status Unhandled');
    }

    this.STATE_TO_DRUGS = {
      'F': this.dealF,
      'H': this.dealH,
      'D': this.dealD,
      'T': this.dealT,
      'X': this.dealX,
    };

    this._state = state;
    this._stateLock = false;
  }

  public get state() {
    return this._state;
  }
  public set state(state: string) {
    if (this._stateLock) {
      return;
    }
    this._state = state;
    this._stateLock = true;
  }

  public giveDrugs(drugs: Array<string>) {
    if (drugs.includes('As') && drugs.includes('P')) {
      this.setDead();
    } else {
      this.STATE_TO_DRUGS[this.state](drugs);
    }
  }

  private dealF = (drugs: Array<string>) => {
    if (drugs.includes('As') || drugs.includes('P')) {
      this.setHealthy();
    }
  }
  private dealH = (drugs: Array<string>) => {
    if (drugs.includes('I') && drugs.includes('An')) {
      this.setFever();
    }
  }

  private dealD = (drugs: Array<string>) => {
    if (!drugs.includes('I')) {
      this.setDead();
    }
  }
  private dealT = (drugs: Array<string>) => {
    if (drugs.includes('An')) {
      this.setHealthy();
    }
  }
  private dealX = (drugs: Array<string>) => {
    // already dead...
    return;
  }

  public setDead() {
    this.state = 'X'
  }

  public setFever() {
    this.state = 'F'
  }

  public setHealthy() {
    this.state = 'H'
  }
}