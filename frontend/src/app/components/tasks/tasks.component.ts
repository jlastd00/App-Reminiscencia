import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from "../../services/sesion.service";
import { AlertService } from "../../services/alert.service";
import { Alert } from 'src/app/models/alert';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(
    private router: Router,
    private sesionService: SesionService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
  }

  finSesion() {

    const sesionActive = JSON.parse(localStorage.getItem('sesion'));

    var fechahoy = new Date();
    const hours = fechahoy.getHours();
    const minutes = fechahoy.getMinutes();
    
    const dataSesion = {
      hora_fin: `${hours}:${minutes}`,
      tareas: sesionActive.tareas
    }
    
    this.sesionService.updateSesion(sesionActive._id, dataSesion)
      .subscribe(
        res => {
          if (!res.success) {
            this.alert.error(res.msg);
            return false;
          }
          //console.log(res.sesion);
          localStorage.removeItem('patient');
          localStorage.removeItem('sesion');
          this.router.navigate(['../dashboard']);
        },
        err => console.log(err)
      );

    
  }

}
