import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCardComponent } from './movie-card.component';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  genre: string;
  rating: number;
  price: number;
  city: string;
  description: string, // Can be a placeholder string
  duration: number, // Can be a placeholder number
  language: string,
}

const MOCK_MOVIE: Movie = {
  id: 1,
  title: 'Avatar: The Way of Water',
  posterUrl: '/assets/posters/avatar.jpg',
  genre: 'Sci-Fi',
  rating: 7.6,
  price: 500,
  city: 'Hyderabad',
  description: 'Test description for mock.', // Can be a placeholder string
  duration: 120, // Can be a placeholder number
  language: 'English'
}

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.movie = MOCK_MOVIE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the movie title in an h3 tag', () => {
    const titleElement = element.querySelector('h3');
    expect(titleElement?.textContent).toContain(MOCK_MOVIE.title);
  });

  it('should display the genre and rating correctly', () => {
    const ptags = element.querySelectorAll('p');
    expect(ptags[0].textContent).toContain(`Genre: ${MOCK_MOVIE.genre}`);
    expect(ptags[1].textContent).toContain(`Rating: ${MOCK_MOVIE.rating}`);
  })

  it('should display the price formatted with currency pipe(INR)', () => {
    const pricelement = element.querySelectorAll('p')[2];
    expect(pricelement.textContent).toContain('Price: ₹500');
  })

  it('should bind the correct posterUrl and title to the <img> tag', () => {
    const imgElement: HTMLImageElement | null = element.querySelector('img');
    expect(imgElement).toBeTruthy();

    expect(imgElement?.src).toContain(MOCK_MOVIE.posterUrl);
    expect(imgElement?.alt).toBeTruthy(MOCK_MOVIE.title);
  })
});
