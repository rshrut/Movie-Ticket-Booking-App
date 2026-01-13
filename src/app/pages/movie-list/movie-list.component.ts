import { Component } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  imports: [CommonModule,MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  movies: Movie[] = [];
  constructor(private movieservice: MovieService){}

  ngOnInit(): void{
    this.movieservice.getMovies().subscribe((data) => {
      this.movies = data;
    })
  }
}
