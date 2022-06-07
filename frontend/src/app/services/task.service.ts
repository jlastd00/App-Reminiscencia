import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskObjetosURL = "http://localhost:3000/tasks/objetos";
  private taskCancionesURL = "http://localhost:3000/tasks/canciones";
  private taskVideosURL = "http://localhost:3000/tasks/videos";

  constructor(
    private http: HttpClient
  ) { }

  getTaskObjeto() {
    return this.http.get<any>(this.taskObjetosURL);
  }

  getTaskCancion() {
    return this.http.get<any>(this.taskCancionesURL);
  }

  getTaskVideo() {
    return this.http.get<any>(this.taskVideosURL);
  }

}
