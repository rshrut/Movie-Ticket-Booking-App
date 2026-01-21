import { Injectable } from "@angular/core";
import { Movie } from "../models/movie.model";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Showtime } from "../models/showtime.model";
import { environment } from "../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private baseUrl = `${environment.apiUrl}`;
    private movieApiUrl = `${this.baseUrl}/movies`;
    private showtimeApiUrl = `${this.baseUrl}/showtimes`;
    private bookingApiUrl = `${this.baseUrl}/bookings`;

    constructor(private http: HttpClient) {

    }

    getMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(this.movieApiUrl);
    }

    getMovieById(id: number): Observable<Movie | undefined> {
        console.log("log");
        return this.http.get<Movie>(`${this.movieApiUrl}/${id}`)
    }

    getShowtimesByMovie(movieId: number): Observable<Showtime[]> {
        return this.http.get<Showtime[]>(`${this.showtimeApiUrl}/movie/${movieId}`);
    }

    getOccupiedSeats(showtimeId: number): Observable<string[]> {
        return this.http.get<string[]>(`${this.bookingApiUrl}/occupied/${showtimeId}`);
    }

    getBookingById(bookingId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/bookings/${bookingId}`);
    }

    getUserBookings(){
        return this.http.get<any[]>(`${this.bookingApiUrl}/user`);
    }
}
