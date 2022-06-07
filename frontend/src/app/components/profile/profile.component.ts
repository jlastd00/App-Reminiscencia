import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  patients: any;

  constructor(
    private _authService: AuthService,
    private _patientService: PatientService,
    private _router: Router
  ) { }

  ngOnInit() {
    
    this.user = JSON.parse(localStorage.getItem('user'));

    var patientsTemp = [];

    this.user.patients.forEach((id) => {
      this._patientService.getPatient(id)
        .subscribe(
          res => {
            patientsTemp.push(res.patient);
          },
          err => console.log(err)
        );
    });
    
    this.patients = patientsTemp;
    
  }
}
