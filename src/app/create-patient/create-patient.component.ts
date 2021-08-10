import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../shared/models/user';
import { PatientService } from '../shared/services/patient.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit, AfterViewInit {

  isLoading = false;
  error = '';
  patientId: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  constructor(private patientService: PatientService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((param: any) => {
      if (param.id) {
        this.patientId = param.id;
      }
    })
  }

  ngAfterViewInit() {
    if (this.patientId)
      this.patientService.getPatientById(this.patientId).then((patient) => {
        console.log(patient)
        this.name = patient.name;
        this.age = patient.age;
        this.gender = patient.gender;
        this.email = patient.email;
      }).catch(err => {
        console.log(err)
      })
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form)
    if (!form.valid) {
      return
    }
    if (this.patientId)
      this.patientService.updatePatient(form.value, this.patientId).then(result => {
        form.reset();
      })
    else
      this.patientService.createPatient(form.value).then(result => {
        form.reset();
      })
  }
}
