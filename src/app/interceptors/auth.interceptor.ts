import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
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
        if(token){
            authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            })
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status === 401){
                   this.handleSessionExpired();
                }
                if (error.status === 403) {
                    const currentToken = this.authService.getToken();
                    if(currentToken && currentToken !== 'null'){
                        this.handleSessionExpired();
                    }
                     else{
                        this.notificationService.error('Access Denied: You are not allowed to perform this action.');
                    }
                }
                return throwError(() => error);
            })
        );
    }

    private handleSessionExpired(): void{
        if(this.authService.getToken()){
            this.notificationService.error('Session expired. Please login again.');
            this.authService.logout();

            this.router.navigate(['/auth/login'],{
                queryParams: { returnUrl: this.router.url }
            })
        }
    }
}
