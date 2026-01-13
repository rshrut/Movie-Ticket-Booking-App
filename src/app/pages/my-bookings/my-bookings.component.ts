import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  imports: [
    RouterModule, 
    DatePipe,
    CommonModule
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent implements OnInit{
  bookings: any[] = [];
  isLoading = true;
  constructor(private movieService: MovieService
  ){}

  ngOnInit(): void {
      this.movieService.getUserBookings().subscribe({
        next: (data) => {
          this.bookings = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching bookings', err);
          this.isLoading = false;
          
        }
      })
  }
}
