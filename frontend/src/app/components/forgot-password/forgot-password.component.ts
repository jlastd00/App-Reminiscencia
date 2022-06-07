import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
  
  form: FormGroup;
  loading = false;
  submitted = false;
  email: {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
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

    this.email = {
      email: this.f.email.value
    }

    this.alertService.clear();
    this.authService.forgotPassword(this.email)
      .pipe(first())
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        res => {
          if (!res.success) {
            this.alertService.error(res.msg);
            return false;
          }
          this.alertService.success(res.msg);
          return true;
        },
        error => console.log(error)
      );
  }
}
