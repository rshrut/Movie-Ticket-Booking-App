import { Component, OnInit } from '@angular/core';
import { BookingStateService, Finalticket } from '../../services/booking-state.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { filter } from 'rxjs/operators';
import { QRCodeComponent } from 'angularx-qrcode'; // This is the standalone component

@Component({
  selector: 'app-ticket',
  imports: [CurrencyPipe, DatePipe, QRCodeComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent implements OnInit{
  ticket: Finalticket | undefined;
  constructor(
    private route: ActivatedRoute,
    private bookingStateService: BookingStateService,
    private movieService: MovieService
  ){}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => id !== null),
      switchMap(id => {
        // const bookingId = id ? +id : 0;
        return this.movieService.getBookingById(id);
      })
    ).subscribe({
      next: (ticketData) => {
        this.ticket = ticketData;
        console.log('ti',ticketData);
        
      },
      error: (err) => {
        console.error('Failed to load ticket:', err);
      }
    })
  }

  downloadTicket(): void{
    if(this.ticket){
      window.print();
    }
  }

  get qrFullData(): string {
    if (!this.ticket) return '';
    
    // Format it as a readable summary or a JSON string
    return `
      --- MOVIE TICKET ---
      ID: ${this.ticket.id}
      Movie: ${this.ticket.showtime.movie.title}
      Theatre: ${this.ticket.showtime.theatre.name}
      Time: ${this.ticket.showtime.startTime}
      Seats: ${this.ticket.seatsBooked}
      Total: ${this.ticket.totalPrice} INR
      --------------------
    `.trim();

  }
}
