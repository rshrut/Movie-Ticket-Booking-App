import { Component, OnInit } from '@angular/core';
import { BookingData, BookingStateService } from '../../services/booking-state.service';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { catchError, delay, of, timer } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  bookingData: BookingData | null = null;
  paymentStatus : 'pending' | 'processing' | 'success' | 'failed' = 'pending';
  theatreName: string = 'Loading Theatre...';
   errorMessage: string = '';

  constructor(
    private bookingStateService: BookingStateService,
    private notificationService: NotificationService,
    private movieService: MovieService,
    private router: Router,
    private http: HttpClient
  ){}

  ngOnInit(): void {
      this.bookingData = this.bookingStateService.getBookingData();

      if(!this.bookingData){
        this.router.navigate(['/movies']);
        return;
      }

      this.theatreName = `Cinema plex ${this.bookingData.theatreName}`;
  }

  processPayment(): void{
    if(!this.bookingData) return;

    this.paymentStatus = 'processing';
    this.errorMessage = '';

    const bookingRequest = {
      showtimeId: this.bookingData.showtimeId,
      seatNumbers: this.bookingData.selectedSeats.join(','),
      totalAmount: this.bookingData.totalAmount
    }

    // of(Math.random() > 0.1)
    // .pipe(delay(2000))
    // .subscribe(isSuccess => {
    //   if(isSuccess){
    //     this.paymentStatus = 'success';
    //     const mockBookingId = Math.floor(Math.random() * 100000);
    //     this.notificationService.success('Payment successful! Redirecting to ticket...')
    //     timer(500).subscribe(() => {
    //       this.router.navigate(['/ticket', mockBookingId]);
    //     })
    //   }
    //   else{
    //     this.paymentStatus = 'failed';
    //     this.notificationService.error('Payment failed. Please try again.');
    //   }
    // })

    this.http.post<any>('http://localhost:8080/api/v1/bookings', bookingRequest)
      .pipe(
        catchError(err => {
          this.paymentStatus = 'failed';
          const msg = err.error?.message || 'Payment failed. Please try again.';
          this.errorMessage = msg;
          this.notificationService.error(msg);
          return of(null);
        })
      )
      .subscribe(response => {
        if(response){
          this.paymentStatus = 'success';
          this.notificationService.success('Payment successful! Your ticket is ready.');
          this.bookingStateService.clearBookingData();
          setTimeout(() => {
            this.router.navigate(['/ticket',response.bookingId])
          }, 1500);
        }
      })
  }

}
