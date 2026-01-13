import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-seat',
  imports: [],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss'
})
export class SeatComponent {
  @Input() id!: string;
  @Input() isBooked:boolean = false;
  @Input() isSelected:boolean = false;

  @Output() selectSeat = new EventEmitter<string>();
}
