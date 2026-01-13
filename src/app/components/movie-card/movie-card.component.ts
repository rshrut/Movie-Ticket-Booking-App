import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent {
  @Input() movie!: Movie;
}
