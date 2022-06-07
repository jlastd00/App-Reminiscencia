import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logoutUser() {
    this.alertService.info('Se ha cerrado la sesión', { keepAfterRouteChange: true });
    return this.authService.logoutUser();
  }

}
