import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private getPatientsURL = "http://localhost:3000/users/patients";

  constructor(
    private http: HttpClient
  ) { }

    getPatients(userID: {}) {
      return this.http.get<any>(this.getPatientsURL, userID);
    }
}
