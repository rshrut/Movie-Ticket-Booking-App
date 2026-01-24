import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface TheatreDetails {
  id: number;
  name: string;
  address: string;
  city: string;
  seatingCapacity: number;
}

export interface BookingData {
  movie: Movie; 
  showtimeId: number;      
  theatreName: any;   
  showTime: string;        
  selectedSeats: string[]; 
  totalAmount: number;
}

export interface Finalticket{
  bookingId: number;
  movie: Movie,
  theatreName: TheatreDetails;
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
    private apiUrl = `${environment.apiUrl}/bookings`;
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
