import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { SeatComponent } from '../../components/seat/seat.component';
import { BookingData, BookingStateService } from '../../services/booking-state.service';
import { AuthService } from '../../services/auth.service';

export interface Seat {
  id: string;
  isBooked: boolean;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, SeatComponent, RouterModule],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.scss'
})
export class SeatSelectionComponent implements OnInit {
  movie: Movie | undefined;
  selectedSeats: string[] = [];
  ticketPrice = 0;
  totalAmount = 0;

  seatMap: Seat[][] = [];
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatsPerRow = 10;

  // Data from Query Params
  showtimeId: number | null = null;
  theatreName: string | null = null;
  showTimeLabel: string | null = null;

  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private bookingStateService: BookingStateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(movieId => {
        const id = movieId ? +movieId : 0;

        // Combine QueryParams observable with Movie/OccupiedSeats logic
        return this.route.queryParamMap.pipe(
          tap(queryParams => {
            this.showtimeId = queryParams.get('showtimeId') ? +queryParams.get('showtimeId')! : null;
            this.theatreName = queryParams.get('theatreName');
            this.showTimeLabel = queryParams.get('time');
          }),
          switchMap(() => {
            // Fetch Movie Details AND Occupied Seats simultaneously
            return forkJoin({
              movie: this.movieService.getMovieById(id),
              occupied: this.showtimeId ? this.movieService.getOccupiedSeats(this.showtimeId) : of([])
            });
          })
        );
      })
    ).subscribe({
      next: (data: any) => {
        this.movie = data.movie;
        this.ticketPrice = data.movie?.price || 200;
        this.initializeSeatMap(data.occupied || []);
        const existingData = this.bookingStateService.getLatestBookingData();
        if (existingData && existingData.showtimeId === this.showtimeId) {
          this.selectedSeats = [...existingData.selectedSeats];
          this.totalAmount = existingData.totalAmount;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading booking data', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Now accepts actual occupied seats from the backend
   */
  initializeSeatMap(occupiedSeats: string[]): void {
    const newMap: Seat[][] = [];
    const occupiedSet = new Set(occupiedSeats.map(s => s.toUpperCase()));

    this.rows.forEach(row => {
      const rowSeats: Seat[] = [];
      for (let i = 1; i <= this.seatsPerRow; i++) {
        const id = `${row}${i}`;
        rowSeats.push({
          id,
          isBooked: occupiedSet.has(id)
        });
      }
      newMap.push(rowSeats);
    });
    this.seatMap = newMap;
  }

  handleSeatClick(seatId: string, isBooked: boolean): void {
    if (isBooked) return;

    const index = this.selectedSeats.indexOf(seatId);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seatId);
    }

    this.totalAmount = this.selectedSeats.length * this.ticketPrice;
  }


  proceedToPayment(): void {

    if (!this.movie || !this.showtimeId || this.selectedSeats.length === 0) {
      console.error('Incomplete data for booking');
      return;
    }

    const dataToSave: BookingData = {
      movie: this.movie,
      showtimeId: this.showtimeId,
      theatreName: this.theatreName || 'Unknown Theatre',
      showTime: this.showTimeLabel || 'N/A',
      selectedSeats: this.selectedSeats,
      totalAmount: this.totalAmount
    };

    this.bookingStateService.setBookingData(dataToSave);

    const token = this.authService.getToken();
    if (!token || token === '[object Object]') {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    this.router.navigate(['/payment']);
  }
}