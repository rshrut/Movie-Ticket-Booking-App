import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatComponent } from './seat.component';
import { By } from '@angular/platform-browser';

describe('SeatComponent', () => {
  let component: SeatComponent;
  let fixture: ComponentFixture<SeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatComponent);
    component = fixture.componentInstance;
    component.id = 'A1'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the seat ID in the button',() => {
    const button:HTMLElement = fixture.debugElement.query(By.css('.seat')).nativeElement;
    expect(button.textContent).toContain('A1');
  })

  it('should apply the "booked" class and disable the button when isBooked is true',() => {
    component.isBooked = true;
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('.seat')).nativeElement;
    expect(button.classList).toContain('booked');
    expect(button.disabled).toBeTrue();
  })

  it('should apply the "selected" class when isSelected is true',() => {
    component.isSelected = true;
    fixture.detectChanges();

    const button: HTMLElement = fixture.debugElement.query(By.css('.seat')).nativeElement;
    expect(button.classList).toContain('selected');
  })

  it('should emit the seat ID when the button is clicked and it is NOT booked',() => {
    let emittedSeatId: string | undefined;
    spyOn(component.selectSeat,'emit');
    component.selectSeat.subscribe((id: string) => emittedSeatId = id);
    const button = fixture.debugElement.query(By.css('.seat'));
    button.triggerEventHandler('click',null);
    expect(component.selectSeat.emit).toHaveBeenCalledWith('A1');
  })
});
