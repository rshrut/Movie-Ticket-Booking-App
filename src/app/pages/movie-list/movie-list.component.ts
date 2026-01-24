import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  imports: [CommonModule,MovieCardComponent, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit{
  movies: Movie[] = [];
  isLoading = true;
  isTakingLong = false;
  error = '';
  constructor(private movieservice: MovieService){}

  ngOnInit(): void{
    this.loadMovies();
  }

  loadMovies(): void{
    this.isLoading = true;
    const longLoadTimer = setTimeout(() => {
      if(this.isLoading){
        this.isTakingLong = true;
      }
    }, 3000);

    this.movieservice.getMovies()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          clearTimeout(longLoadTimer);
        })
      )
      .subscribe({
        next: (data) => {
          this.movies =  data;
        },
        error: (err) => {
          this.error = 'Unable to connect to the server. Please refresh.';
          console.error('fetch error',err);
        }
      })
  }
}
