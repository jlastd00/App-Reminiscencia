import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private saveSesionURL = "http://localhost:3000/sesions/sesion";
  private updateSesionURL = "http://localhost:3000/sesions/sesion/";

  constructor(
    private http: HttpClient
  ) { }

  saveSesion(sesion: {}) {
    return this.http.post<any>(this.saveSesionURL, sesion);
  }

  updateSesion(id, dataSesion) {
    return this.http.put<any>(this.updateSesionURL + id, dataSesion);
  }
}
