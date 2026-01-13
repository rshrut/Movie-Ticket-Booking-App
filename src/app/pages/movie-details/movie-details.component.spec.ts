import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsComponent } from './movie-details.component';
import { Movie } from '../../models/movie.model';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { By } from '@angular/platform-browser';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie Details',
  posterUrl: '/assets/test.jpg',
  genre: 'Action',
  rating: 8.5,
  price: 250,
  city: 'Test City',
  description: 'Test description.',
  duration: 120,
  language: 'English',
};

class MockMovieService{
getMovies(): Observable<Movie[]> {
    return of([mockMovie]); // Returns an array, even though not used here
  }

  // 2. Keep the method used by MovieDetailsComponent
  getMovieById(id: number): Observable<Movie | undefined>{
    return of(mockMovie);
  }
}

const mockActivatedRoute = {
  paramMap: of(convertToParamMap({id: '1'}))
};

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent],
      providers:[
        { provide: MovieService, useClass: MockMovieService},
        { provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details based on ID on ngOnInit', () => {
    const getMovieSpy = spyOn(movieService,'getMovieById').and.returnValue(of(mockMovie));
    fixture.detectChanges();

    expect(getMovieSpy).toHaveBeenCalledWith(1);
    expect(component.movie).toEqual(mockMovie);
  })

  it("should display the movie title in the H1 tag",() => {
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.debugElement.query(
      By.css('.info-block h1')
    ).nativeElement;
    expect(titleElement.textContent).toContain(mockMovie.title);
  })

  it("should render the mock showtime list",() => {
    fixture.detectChanges();
    const theatreCards = fixture.debugElement.queryAll(By.css('.theatre-card'));
    expect(theatreCards.length).toBe(component.theatres.length);
  })
});
