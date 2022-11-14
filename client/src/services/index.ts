import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export const authService = AuthService.getInstance();
export const notificationService = NotificationService.getInstance();
