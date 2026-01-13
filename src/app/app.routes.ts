import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'movies',
        pathMatch: 'full'
    },
    {
        path: 'movies',
        component: MovieListComponent
    },
    {
        path: 'movies/:id',
        component: MovieDetailsComponent
    },
    {
        path: 'movies/:id/booking',
        component: SeatSelectionComponent
    },
    {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [authGuard]
    },
    {
        path: 'ticket/:id',
        component: TicketComponent,
        canActivate: [authGuard]
    },
    {
        path:'my-bookings',
        component: MyBookingsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'auth',
        children: [
            { 
                path: 'login', 
                component: LoginComponent 
            },
            {
                path:'register',
                component: RegisterComponent
            },
            {
                path: '',
                redirectTo:'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'movies'
    }
];
