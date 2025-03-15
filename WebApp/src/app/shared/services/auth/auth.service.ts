import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../../interfaces/user-login.interface';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { UserForgotPassword } from '../../interfaces/user-forgot-password.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private client: HttpClient) {}
  apiUrl = environment.baseApiUrl;

  login(user: UserLogin) {
    return this.client.post(`${this.apiUrl}/users/login`, user);
  }

  register(user: any) {
    return this.client.post(`${this.apiUrl}/users/register`, user);
  }

  forgotPassword(model : UserForgotPassword): Observable<any> {
    return this.client.post(`${this.apiUrl}/users/forgot-password`, model);
  }

  confirmEmail(email: string, token: string): Observable<any> {
    return this.client.get(`${this.apiUrl}/users/confirmation`, {
      headers: {
        email: email,
        token: token,
      },
    });
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.client.post(`${this.apiUrl}/users/confirmation`, {
      email: email,
    });
  }
}
