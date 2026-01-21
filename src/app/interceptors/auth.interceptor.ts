import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../shared/services/notification.service";


export class AuthInterceptor implements HttpInterceptor {
    private router = inject(Router);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('auth_token');

        let authReq  = req;
        if(token && token !== 'null' && token !== 'undefined' && token !== '[object Object]'){
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            })
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status === 401){
                   this.handleSessionExpired('Your session has expired. Please login again.');
                }
                if (error.status === 403) {
                    const currentToken = this.authService.getToken();
                    if(currentToken){
                        console.warn('403 Forbidden: This might be a CORS error or restricted access. Not logging out yet.');
                        this.notificationService.error('Access Denied: You do not have permission for this action.');
                    }
                     else{
                        this.notificationService.error('Please login to continue.');
                    }
                }
                return throwError(() => error);
            })
        );
    }

    private handleSessionExpired(message: string): void{
        if(this.authService.getToken()){
            this.notificationService.error(message);
            this.authService.logout();

            this.router.navigate(['/auth/login'],{
                queryParams: { returnUrl: this.router.url }
            })
        }
    }
}
