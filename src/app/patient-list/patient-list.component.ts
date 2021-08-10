import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { PatientDetailComponent } from '../components/patient-detail/patient-detail.component';
import { Patient } from '../shared/models/user';
import { PatientService } from '../shared/services/patient.service';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {

  patients: Patient[] = []
  displayedColumns: string[] = ['position', 'name', 'age', 'email', 'gender', "edit", "delete"];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  search = ''
  constructor(public patientService: PatientService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.patientService.getPatientList()
      .then((patients) => {
        this.patients = [...patients]
        this.dataSource = new MatTableDataSource(this.patients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  onDelete(patient: Patient, index: number) {
    console.log(index)
    let dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: `Are you sure want to remove ${patient.email}?`,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.patientService.deletePatient(patient.id).then(() => {
          this.patients.splice(index, 1)
          this.dataSource = new MatTableDataSource(this.patients);
        }).catch(err => {
          console.log(err)
        })
      }
    })
  }

  applyFilter(event) {
    let value = event.target.value
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  onPatientClick(patient: Patient) {
    console.log(patient)
    let dialogRef = this.matDialog.open(PatientDetailComponent, {
      data: patient,
      disableClose: false,
      width: '300px'
    })
  }
}
