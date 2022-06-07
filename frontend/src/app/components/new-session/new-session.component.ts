import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { SesionService } from "../../services/sesion.service";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.css']
})
export class NewSessionComponent implements OnInit {

  user: any;
  patients: any;
  selectedPatient: any;

  constructor(
    private alert: AlertService,
    private patientService: PatientService,
    private sesionService: SesionService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('user'));

    var patientsTemp = [];

    this.user.patients.forEach((id) => {
      this.patientService.getPatient(id)
        .subscribe(
          res => {
            patientsTemp.push(res.patient);
          },
          err => console.log(err)
        );
    });
    
    this.patients = patientsTemp;
    //console.log(this.patients);
  }

  onSubmit() {

    if (this.selectedPatient == -1) {
      this.alert.error('No has seleccionado el paciente', { keepAfterRouteChange: true });
      return false;
    }
    //console.log(this.selectedPatient);

    var fechahoy = new Date();
    const day = fechahoy.getDate();
    const month = fechahoy.getMonth() + 1;
    const year = fechahoy.getFullYear();
    const hours = fechahoy.getHours();
    const minutes = fechahoy.getMinutes();

    // Guardar entrada de la sesion en la base de datos
    const sesion = {
      titulo: `Sesión de reminiscencia - día ${day}/${month}/${year} - ${hours}:${minutes}`,
      idPaciente: this.selectedPatient._id,
      hora_inicio: `${hours}:${minutes}`,
      hora_fin: "",
      tareas: []
    }

    this.sesionService.saveSesion(sesion)
      .subscribe(
        res => {
          if (!res.success) {
            this.alert.error(res.msg);
            return false;
          }
          //console.log(res.sesion);
          localStorage.setItem('patient', JSON.stringify(this.selectedPatient));
          localStorage.setItem('sesion', JSON.stringify(res.sesion));
          this.router.navigate(['../tasks']);
        },
        err => console.log(err)
      );

    

  }

}
