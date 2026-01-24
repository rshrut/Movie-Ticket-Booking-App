import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { RegisterRequest } from "../models/registerRequest.model";
import { LoginRequest } from "../models/loginRequest.model";
import { environment } from "../../environments/environment";

export interface AuthResponse {
    token: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private tokenKey = 'auth_token';
    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private hasToken(): boolean{
      const token = localStorage.getItem(this.tokenKey);
      return !!token;
    }

    constructor(private http: HttpClient) { }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
            tap((response: AuthResponse) => {
                if (response && response.token) {
                    console.log('Token successfully received');
                    localStorage.setItem(this.tokenKey, response.token);
                    this.isLoggedInSubject.next(true);
                } else {
                    console.error('Response received but token field is missing', response);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.isLoggedInSubject.next(false);
    }

}