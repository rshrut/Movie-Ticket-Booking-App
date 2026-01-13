import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification, NotificationService } from '../services/notification.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {

  notification$: Observable<Notification | null>;

  constructor(private notificationService: NotificationService){
    this.notification$ = this.notificationService.notification$;
  }

  dismiss(): void{
    this.notificationService.clear();
  }
}
