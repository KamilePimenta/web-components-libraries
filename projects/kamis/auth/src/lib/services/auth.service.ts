import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { IAuthLoginResponseModel } from './models/auth-login.response.model';
import { IAuthRefreshTokenResponseModel } from './models/auth-refresh-token.response.model';
import { IAuthGetUserResponseModel } from './models/auth-get-user.response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://dummyjson.com/auth';
  private baseHeaders: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Access-Control-Allow-Credentials': 'true',
  });


  constructor(private http: HttpClient) {}

  login(user: string, passcode: string): Observable<IAuthLoginResponseModel> {
    const url = this.baseUrl + '/login';
    const body = JSON.stringify({ username: user, password: passcode, expiresInMins: 120 });
    return this.http.post<IAuthLoginResponseModel>(url, body, {
      headers: this.baseHeaders,
      withCredentials: true,
    }).pipe(catchError(err => this.handleError(err)));
  }

  getUser(authorizationCode: string): Observable<IAuthGetUserResponseModel> {
    const url = this.baseUrl + '/me';
    const headers = { Authorization: authorizationCode, 'Access-Control-Allow-Origin': '*' };
    return this.http.get<IAuthGetUserResponseModel>(url, {
      headers,
      withCredentials: true,
    }).pipe(catchError(err => this.handleError(err)));
  }

  refreshToken(refreshCode: string): Observable<IAuthRefreshTokenResponseModel> {
    const url = this.baseUrl + '/refresh';
    const body = JSON.stringify({ refreshToken: refreshCode, expiresInMins: 120 });
    return this.http.post<IAuthRefreshTokenResponseModel>(url, body, {
      headers: this.baseHeaders,
      withCredentials: true,
    }).pipe(catchError(err => this.handleError(err)));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.', {
      cause: error,
    }));
  }
}
