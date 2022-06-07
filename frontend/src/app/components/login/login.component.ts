import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  
  form: FormGroup;
  loading = false;
  submitted = false;
  userdata: {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    this.authService.loginUser(this.userdata)
      .pipe(first())
      .subscribe(
        res => {
          if (!res.success) {
            this.alertService.error(res.msg, { keepAfterRouteChange: true });
            this.loading = false;
            return false;
          }
          this.alertService.success('Login successfull', { keepAfterRouteChange: true });
          this.authService.storeUserData(res.token, res.user);
          this.router.navigate(['../dashboard']);
          return true;
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }
}
