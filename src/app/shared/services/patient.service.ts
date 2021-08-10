import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../models/user';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  baseUrl = 'http://localhost:3000/patients'
  constructor(private httpClient: HttpClient, private router: Router) { }

  createPatient(patient: Patient) {
    return this.httpClient.post(this.baseUrl, patient)
      .toPromise()
      .then(result => {
        this.router.navigate(['dashboard'])
        return result
      })
  }

  updatePatient(patient: Patient, id) {
    console.log(patient)
    return this.httpClient.put(this.baseUrl + '/' + id, patient)
      .toPromise()
      .then(result => {
        this.router.navigate(['dashboard'])
        return result
      })
  }

  getPatientById(id: string) {
    return this.httpClient.get<Patient>(this.baseUrl + '/' + id)
      .toPromise()
      .then(patient => {
        return patient;
      })
  }

  deletePatient(id) {
    return this.httpClient.delete(this.baseUrl + '/' + id)
      .toPromise()
      .then(patient => {
        return patient;
      })
  }

  getPatientList() {
    return this.httpClient.get<Patient[]>(this.baseUrl)
      .toPromise()
      .then((patients: Patient[]) => {
        console.log(patients)
        return patients
      })
  }

  exportToCSV(data: Patient[]) {
    if (data) {
      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
      var blob = new Blob([csvArray], { type: 'text/csv' })
      saveAs(blob, "myFile.csv");
    }
  }
}
