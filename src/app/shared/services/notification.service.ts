import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

export type NotificationType = 'success' | 'error'| 'warning' | 'info';

export interface Notification{
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  private readonly DURATION_MS = 3000;
  constructor() { }

  show(message: string, type: NotificationType = 'info'): void{
    const notification: Notification = {message, type}
    this.notificationSubject.next(notification);

    timer(this.DURATION_MS).subscribe(() => {
      this.clear();
    })
  }

  clear(): void{
    this.notificationSubject.next(null);
  }

  success(message: string):void{
    this.show(message, 'success');
  }

  error(message: string): void{
    this.show(message, 'error');
  }
}
