import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AlertService } from '../../services/alert.service';
import { TaskService } from "../../services/task.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tipo: String;
  videos: any;
  urlVideo: null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
    private taskService: TaskService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.tipo = this.route.snapshot.params['tipo'];
    // remove tipo from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    if (this.tipo != "objeto" && this.tipo != "cancion" && this.tipo != "video") {
      this.alert.error('El tipo de tarea no es correcta', { keepAfterRouteChange: true });
      this.router.navigate(['../tasks']);
    }

    if (this.tipo == "objeto") {
      this.taskService.getTaskObjeto()
        .subscribe(
          res => {
            console.log(res.msg)
          },
          err => console.log(err)
        )
    }

    if (this.tipo == "cancion") {
      this.taskService.getTaskCancion()
        .subscribe(
          res => {
            console.log(res.msg)
          },
          err => console.log(err)
        )
    }

    if (this.tipo == "video") {
      this.taskService.getTaskVideo()
        .subscribe(
          res => {
            this.videos = res.videos;
            //console.log(this.videos);
          },
          err => console.log(err)
        )
    }

  }

  reproducir(url) {
    this.urlVideo = url;
  }

  getVideoIframe(url) {
    
    var video, results;
 
    if (url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];
 
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);  
  }



}
