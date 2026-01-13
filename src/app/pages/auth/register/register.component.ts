import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  newUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  isLoading = false;
  returnUrl: string = '/movies';

  constructor(private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.returnUrl  = this.route.snapshot.queryParams['returnUrl'] || '/movies';
  }

  onSubmit(): void {
    if (this.newUser.password !== this.newUser.confirmPassword) {
      alert("Error: Passwords do not match.");
      return;
    }

    this.isLoading = true;
    this.authService.register({
      name: this.newUser.name,
      email: this.newUser.email,
      password: this.newUser.password
    })
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (response) => {
        this.notificationService.success('Registration successful! Please log in.');
        this.router.navigate(['/auth/login'],{
          queryParams: { returnUrl: this.returnUrl}
        })
      },
      error:(err) => {
        const errorMessage = err.error || 'Registration failed. Please try again.';
        this.notificationService.error(errorMessage);
      }
    })

  }
}
