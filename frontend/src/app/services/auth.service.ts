import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private registerURL = "http://localhost:3000/users/register";
  private loginURL = "http://localhost:3000/users/login";
  private profileURL = "http://localhost:3000/users/profile";
  private verifyEmailURL = "http://localhost:3000/users/verify";
  private forgotPasswordURL = "http://localhost:3000/users/forgot-password";
  private resetPasswordURL = "http://localhost:3000/users/reset-password";
  private validateResetTokenURL = "http://localhost:3000/users/validate-reset-token";
  
  authToken: any;
  authUser: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  registerUser(user: {}) {
    return this.http.post<any>(this.registerURL, user);
  }

  verifyEmail(token: {}) {
    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http.post<any>(this.verifyEmailURL, token, { headers: headers });
  }

  loginUser(userdata: {}) {
    return this.http.post<any>(this.loginURL, userdata);
  }

  forgotPassword(email: {}) {
    return this.http.post<any>(this.forgotPasswordURL, email);
  }

  validateResetToken(token: {}) {
    return this.http.post<any>(this.validateResetTokenURL, token);
  }

  resetPassword(userdata: {}) {
    return this.http.post<any>(this.resetPasswordURL, userdata);
  }

  getProfile() {
    return this.http.get<any>(this.profileURL);
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.authUser = user;
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

}
