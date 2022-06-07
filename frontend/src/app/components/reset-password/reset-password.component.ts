import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

import { MustMatch } from '../../helpers/must-match.validator';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({ templateUrl: 'reset-password.component.html' })
export class ResetPasswordComponent implements OnInit {
  
  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  form: FormGroup;
  loading = false;
  submitted = false;
  token = {};
  tokenRecived: String;
  userdata = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.token = {
      token: this.route.snapshot.queryParams['token']
    }

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.authService.validateResetToken(this.token)
      .pipe(first())
      .subscribe(
        res => {
          if (!res.success) {
            this.alertService.error(res.mg);
            this.tokenStatus = TokenStatus.Invalid;
          }
          this.tokenRecived = res.token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error => {
          console.log(error);
        }
      );
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    
    this.loading = true;

    this.userdata = {
      userToken: this.tokenRecived,
      password: this.form.get('password').value,
      confirmPassword: this.form.get('confirmPassword').value
    }

    this.authService.resetPassword(this.userdata)
      .pipe(first())
      .subscribe(
        res => {
          if (!res.success) {
            this.alertService.error(res.msg);
            this.loading = false;
            return false;
          }
          this.alertService.success(res.msg, { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
          return true;
        },
        error => {
          console.log(error);
        }
      );
  }
}
