import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private getPatientURL = "http://localhost:3000/patients/patient/";

  constructor(
    private http: HttpClient
  ) { }

  getPatient(id: {}) {
    return this.http.get<any>(this.getPatientURL + id);
  }
}
