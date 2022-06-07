import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

import { MustMatch } from '../../helpers/must-match.validator';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  
  form: FormGroup;
  loading = false;
  submitted = false;
  user: {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
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

    this.user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      confirmPassword: this.form.get('confirmPassword').value
    }

    this.authService.registerUser(this.user)
      .pipe(first())
      .subscribe(
        res => {
          if (!res.success) {
            this.alertService.error(res.msg, { keepAfterRouteChange: true });
            this.loading = false;
            return false;
          }
          this.alertService.success(res.msg + ': Por favor, revise su email para verificar su cuenta.', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
          this.loading = false;
          return true;
        },
        error => {
          console.log(error);
          return false;
        }
      );
  }
}
