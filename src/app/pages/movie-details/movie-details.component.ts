import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Showtime } from '../../models/showtime.model';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | undefined;

  showtimes: Showtime[] = [];
  showtimesGrouped: { theatreName: string, theatreId: number, times: Showtime[] }[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private movieService: MovieService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        this.isLoading = true;
        this.error = null;

        const movieId = id ? +id : 0;
        const movieDetails$ = this.movieService.getMovieById(movieId).pipe(
          catchError(err => {
            console.error('Error fetching movie details:', err);
            this.error = 'Failed to load movie details.';
            return of(undefined as Movie | undefined);
          })
        );
        const showtimes$ = this.movieService.getShowtimesByMovie(movieId).pipe(
          catchError(err => {
            console.warn('Error fetching showtimes, but movie details might still load.', err);
            // Return an empty array on error so forkJoin still succeeds
            return of([] as Showtime[]);
          })
        );
        return forkJoin([movieDetails$, showtimes$]);
      }),
      tap(([movie, showtimes]) => {
        if (movie) {
          this.movie = movie;
          this.showtimes = showtimes;
          console.log("st",this.showtimes);
          
          this.groupShowtimes();
        } else {
          this.movie = undefined;
          if (!this.error) {
            this.error = "Movie not found.";
          }
        }
      })
    ).subscribe({
      error: err => {
        this.isLoading = false;
        this.error = this.error || 'An unknown error occurred during data loading.';
        console.error('Final subscription error:', err);
      }
    })
  }


  groupShowtimes(): void {
    const groupedMap = new Map<number, { theatreName: string, theatreId: number, times: Showtime[] }>();
    this.showtimes.forEach(showtime => {

      if (showtime.theatre) {
        const id = showtime.theatre.id;
        if (!groupedMap.has(id)) {
          groupedMap.set(id, {
            theatreName: showtime?.theatre?.name,
            theatreId: id,
            times: []
          })
        }
        groupedMap.get(id)?.times.push(showtime);
      }
    })

    this.showtimesGrouped = Array.from(groupedMap.values());
    console.log('grou',this.showtimesGrouped);
    
  }
}
