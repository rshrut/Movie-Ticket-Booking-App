import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService){
  }

  ngOnInit(): void{
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    })
  }

  logout(): void{
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/movies']);
  }

}
