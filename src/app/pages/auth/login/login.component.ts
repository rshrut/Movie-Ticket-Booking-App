import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  user = {
    email: '',
    password: ''
  }

  returnUrl: string = '/movies';
  isLoading = false;

  constructor(private router: Router,
    private authService: AuthService, // Inject AuthService
    private notificationService: NotificationService,
    private route: ActivatedRoute  ){
  }

  ngOnInit(): void {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/movies';
  }

  onSubmit(): void {
    this.isLoading = true;
    this.authService.login(this.user)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (response) => {
        this.notificationService.success("Login successful!");
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        const errorMessage = err.error || 'Invalid credentials';
        this.notificationService.error(errorMessage);
      }
    })
  }
}
