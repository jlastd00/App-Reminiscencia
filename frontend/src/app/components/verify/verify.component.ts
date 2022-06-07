import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { first } from 'rxjs/operators';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({ templateUrl: 'verify.component.html' })
export class VerifyComponent implements OnInit {
  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  token: {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.token = {
      token: this.route.snapshot.queryParams['token']
    }
    //this.token = this.route.snapshot.queryParams['token'];
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
    console.log(this.token);
    this.authService.verifyEmail(this.token)
      .pipe(first())
      .subscribe(
          res => {
            if (res.success) {
              this.alertService.success(res.msg, { keepAfterRouteChange: true });
              this.router.navigate(['../login'], { relativeTo: this.route });
              return true;
            }
            this.alertService.error(res.msg, { keepAfterRouteChange: true });
            return false;
          },
          error => {
            this.emailStatus = EmailStatus.Failed;
            console.log(error);
          }
      );
  }
}
