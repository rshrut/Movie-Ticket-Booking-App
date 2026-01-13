import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieListComponent } from './movie-list.component';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { of } from 'rxjs';

// --- Interface for Mock Data (Good practice) ---
interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  genre: string;
  rating: number;
  price: number;
  city: string;
}

// --- Mock Service to Isolate the Component ---
class MockMovieService {
  getMovies() {
    // Returns an observable that immediately emits 3 mock movie objects
    return of<Movie[]>([
      { id: 1, title:'Avengers: Endgame', posterUrl: '/path/1', genre: 'Action', rating: 8.5, price: 250, city:'Bangalore' },
      { id: 2, title: 'Inception', posterUrl: '/path/2', genre: 'Sci-Fi', rating: 8.8, price: 200, city: 'Mumbai' },
      { id: 3, title: 'Interstellar', posterUrl: '/path/3', genre: 'Astronomy', rating: 9.8, price: 300, city: 'Chennai' }
    ]);
  }
}

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  // We grab the mock service instance for potential spying, though not strictly needed here
  let movieService: MovieService; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // We import MovieListComponent and its dependency, MovieCardComponent, 
      // so Angular can properly compile the template.
      imports: [MovieListComponent, MovieCardComponent], 
      providers: [
        // This tells Angular: whenever someone asks for MovieService, use MockMovieService instead.
        { provide: MovieService, useClass: MockMovieService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);

    // CRITICAL: fixture.detectChanges() triggers Angular's change detection cycle, 
    // which calls ngOnInit() on the component, causing it to subscribe to the mock service.
    fixture.detectChanges(); 
  });

  // Test 1: Sanity Check
  it('should create the MovieListComponent successfully', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Data Loading Logic
  it('should fetch and populate the movies array with 3 items on initialization', () => {
    // Because fixture.detectChanges() ran in beforeEach, the movies array should now be populated
    expect(component.movies.length).toBe(3);
    expect(component.movies[0].title).toBe('Avengers: Endgame');
  });

  // Test 3: Template Rendering (using the provided template)
  it('should render the correct number of movie-card components', () => {
    // Get the native HTML element for the component
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check how many instances of the child component selector exist in the DOM
    const movieCards = compiled.querySelectorAll('app-movie-card');
    
    // We expect 3 cards because the mock service provided 3 movies
    expect(movieCards.length).toBe(3);
  });
});
