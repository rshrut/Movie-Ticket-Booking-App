import { Component, OnInit } from '@angular/core';
import { BookingStateService, Finalticket } from '../../services/booking-state.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-ticket',
  imports: [CurrencyPipe],
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
      switchMap(id => {
        const bookingId = id ? +id : 0;
        return this.movieService.getBookingById(bookingId);
      })
    ).subscribe({
      next: (ticketData) => {
        this.ticket = ticketData;
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
}
