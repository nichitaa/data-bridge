import { Subject } from 'rxjs';
import { ToastVariant } from '../shared/toast/toast.types';

export type Notification =
  | {
      variant: ToastVariant;
      message: string;
      method: string; // mb enum ?
    }
  | undefined;
type Notification$ = Subject<Notification>;

export class NotificationService {
  private static instance: NotificationService;
  private notification$: Notification$;

  private constructor() {
    this.notification$ = new Subject();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public notify(event: Notification): void {
    this.notification$.next(event);
  }

  public get notificationStream(): Notification$ {
    return this.notification$;
  }
}
