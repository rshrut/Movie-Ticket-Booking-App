import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';



export interface BookingData {
  movie: Movie; 
  showtimeId: number;      
  theatreName: string;   
  showTime: string;        
  selectedSeats: string[]; 
  totalAmount: number;
}

export interface Finalticket extends BookingData {
  bookingId: number;
  movie: Movie,
  theatreName: string;
  showTime: string;
  selectedSeats: string[];
  totalAmount: number;
  bookingDate: string;
  confirmationCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  private bookingSource = new BehaviorSubject<BookingData | null>(null);
  currentBooking$ = this.bookingSource.asObservable();
    private apiUrl = 'http://localhost:8080/api/v1/bookings';
  constructor(private http: HttpClient) { }

  setBookingData(data: BookingData): void {
    this.bookingSource.next(data);
  }

  getLatestBookingData(): BookingData | null {
    return this.bookingSource.getValue();
  }


  getBookingData(): BookingData | null {
    return this.bookingSource.getValue();
  }

  clearBookingData(): void {
    this.bookingSource.next(null);
  }

  getFinalTicket(id: number): Observable<Finalticket> {
        return this.http.get<Finalticket>(`${this.apiUrl}/${id}`);
  }
}
