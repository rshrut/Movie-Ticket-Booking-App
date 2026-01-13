import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatSelectionComponent } from './seat-selection.component';
import { Movie } from '../../models/movie.model';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { SeatComponent } from '../../components/seat/seat.component';
import { By } from '@angular/platform-browser';


const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  posterUrl: '/assets/test.jpg',
  genre: 'Action',
  rating: 8,
  price: 250, // Base ticket price
  city: 'Test City',
  description: 'Test description.',
  duration: 120,
  language: 'English',
};

// --- MOCK DEPENDENCIES ---
class MockMovieService {
  // Must satisfy the interface (as fixed previously)
  getMovies() { return of([mockMovie]); } 
  getMovieById(id: number) { return of(mockMovie); }
}

const mockActivatedRoute = {
  // Mocking route params for the movie ID
  paramMap: of(convertToParamMap({ id: '1' })), 
  // Mocking query params for theatre and time
  queryParamMap: of(convertToParamMap({ theatre: '101', time: '10:00 AM' })),
};

describe('SeatSelectionComponent', () => {
  let component: SeatSelectionComponent;
  let fixture: ComponentFixture<SeatSelectionComponent>;
  let movieservice: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatSelectionComponent, SeatComponent],
      providers:[
        { provide: MovieService, useClass: MockMovieService},
        { provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatSelectionComponent);
    component = fixture.componentInstance;
    movieservice = TestBed.inject(MovieService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.seatMap.length).toBe(component.rows.length);
    expect(component.seatMap[0].length).toBe(component.seatsPerRow);
  });

  it('should fetch movie details and set ticket price on ngOnInit', () => {
    const getMovieSpy = spyOn(movieservice,'getMovieById').and.callThrough();
    fixture.detectChanges();

    expect(getMovieSpy).toHaveBeenCalledWith(1);
    expect(component?.movie?.title).toBe(mockMovie.title);
    expect(component.ticketPrice).toBe(mockMovie.price);
  })

  it('should extract theatre ID and show time from query params',() => {
    fixture.detectChanges();
    expect(component.theatreId).toBe('101');
    expect(component.showTime).toBe('10:00 AM');
    fixture.detectChanges();
    const theatreElement: HTMLElement = fixture.debugElement.queryAll(By.css('.summary-bar strong'))[0].nativeElement;
    expect(theatreElement.textContent).toContain('101');
  });

  it('should add a seat to selectedSeats and update totalAmount',() => {
    component.ticketPrice = 100;
    expect(component.selectedSeats.length).toBe(0);
    expect(component.totalAmount).toBe(0);

    component.handleSeatClick('A1',false);

    expect(component.selectedSeats).toEqual(['A1']);
    expect(component.totalAmount).toBe(100);

     component.handleSeatClick('A2', false);

    expect(component.selectedSeats.length).toBe(2);
    expect(component.totalAmount).toBe(200);
  })

  it('should not change selectedSeats when a booked seat is clicked',() => {
    component.selectedSeats = ['C5'];
    component.totalAmount = 100;
    component.handleSeatClick('A5',true);

    expect(component.selectedSeats).toEqual(['C5']);
    expect(component.totalAmount).not.toBe(0);
  })

  it('should disable the proceed button when no seats are selected',() => {
    fixture.detectChanges();
    component.selectedSeats = [];
    fixture.detectChanges();
    let button = fixture.debugElement.query(By.css('.proceed-button')).nativeElement as HTMLButtonElement;
    expect(button.disabled).toBeTrue();

    component.selectedSeats = ['D1'];
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('.proceed-button')).nativeElement as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  })
}); 
